<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AuthUser;
use PDO;
use RuntimeException;

final class GameRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function begin(): void
    {
        $this->db->beginTransaction();
    }

    public function commit(): void
    {
        $this->db->commit();
    }

    public function rollBack(): void
    {
        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }
    }

    public function upsertPlayer(AuthUser $user): void
    {
        $now = $this->now();
        $statement = $this->db->prepare(
            'INSERT INTO players (
                auth_user_id, email, username, display_name, roles_json, auth_type, is_guest, created_at, updated_at, last_seen_at
             ) VALUES (
                :auth_user_id, :email, :username, :display_name, :roles_json, :auth_type, :is_guest, :created_at, :updated_at, :last_seen_at
             ) ON DUPLICATE KEY UPDATE
                email = VALUES(email),
                username = VALUES(username),
                display_name = VALUES(display_name),
                roles_json = VALUES(roles_json),
                auth_type = VALUES(auth_type),
                is_guest = VALUES(is_guest),
                updated_at = VALUES(updated_at),
                last_seen_at = VALUES(last_seen_at)'
        );

        $statement->execute([
            'auth_user_id' => $user->id,
            'email' => $user->email,
            'username' => $user->username,
            'display_name' => $user->displayName,
            'roles_json' => $this->json($user->roles),
            'auth_type' => $user->authType,
            'is_guest' => $user->isGuest ? 1 : 0,
            'created_at' => $now,
            'updated_at' => $now,
            'last_seen_at' => $now,
        ]);
    }

    public function loadGame(AuthUser $user): array
    {
        $this->upsertPlayer($user);
        $save = $this->findSaveByUserId($user->id);
        return [
            'user' => $user->toArray(),
            'game_state' => $save === null ? [] : $this->decodeState((string) $save['game_state_json']),
            'updated_at' => $save['updated_at'] ?? null,
        ];
    }

    public function loadOrCreateState(AuthUser $user, array $initialState): array
    {
        $this->upsertPlayer($user);

        $save = $this->findSaveByUserId($user->id);
        if ($save !== null) {
            return $this->loadGame($user);
        }

        $this->persistState($user->id, $initialState);
        return $this->loadGame($user);
    }

    public function replaceGameState(AuthUser $user, array $gameState): array
    {
        $this->upsertPlayer($user);
        $this->persistState($user->id, $gameState);
        return $this->loadGame($user);
    }

    public function saveGame(AuthUser $user, array $gameState): array
    {
        $this->upsertPlayer($user);
        $this->persistState($user->id, $gameState);
        return $this->loadGame($user);
    }

    public function findSaveByUserId(string $authUserId): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM game_saves WHERE auth_user_id = :auth_user_id LIMIT 1');
        $statement->execute(['auth_user_id' => $authUserId]);
        $row = $statement->fetch();

        return is_array($row) ? $row : null;
    }

    public function moveGuestSaveToUser(string $guestUserId, AuthUser $targetUser): array
    {
        if ($guestUserId === $targetUser->id) {
            throw new RuntimeException('Guest session is already linked to this account.');
        }

        $this->begin();
        try {
            $this->upsertPlayer($targetUser);

            $guestSave = $this->findSaveByUserId($guestUserId);
            if ($guestSave === null) {
                throw new RuntimeException('Guest save not found.');
            }

            $targetSave = $this->findSaveByUserId($targetUser->id);
            if ($targetSave !== null) {
                $deleteTarget = $this->db->prepare('DELETE FROM game_saves WHERE id = :id');
                $deleteTarget->execute(['id' => (int) $targetSave['id']]);
            }

            $move = $this->db->prepare(
                'UPDATE game_saves
                 SET auth_user_id = :target_user_id, updated_at = :updated_at
                 WHERE id = :save_id'
            );
            $move->execute([
                'target_user_id' => $targetUser->id,
                'updated_at' => $this->now(),
                'save_id' => (int) $guestSave['id'],
            ]);

            $deleteGuest = $this->db->prepare('DELETE FROM players WHERE auth_user_id = :guest_user_id');
            $deleteGuest->execute(['guest_user_id' => $guestUserId]);

            $this->commit();
            return $this->loadGame($targetUser);
        } catch (\Throwable $error) {
            $this->rollBack();
            throw $error;
        }
    }

    private function persistState(string $authUserId, array $gameState): void
    {
        $now = $this->now();
        $statement = $this->db->prepare(
            'INSERT INTO game_saves (auth_user_id, game_state_json, version, created_at, updated_at)
             VALUES (:auth_user_id, :game_state_json, 1, :created_at, :updated_at)
             ON DUPLICATE KEY UPDATE
                game_state_json = VALUES(game_state_json),
                updated_at = VALUES(updated_at)'
        );
        $statement->execute([
            'auth_user_id' => $authUserId,
            'game_state_json' => $this->json($gameState),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    private function decodeState(string $json): array
    {
        $decoded = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }

        return is_array($decoded) ? $decoded : [];
    }

    private function json(array $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
    }

    private function now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }
}
