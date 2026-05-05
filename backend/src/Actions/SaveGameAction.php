<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\DaemonGameEngine;
use DomainException;

final class SaveGameAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly DaemonGameEngine $gameEngine
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $gameState = $body['game_state'] ?? null;
        if (!is_array($gameState)) {
            throw new DomainException('game_state payload must be an array.');
        }

        $payload = $this->gameRepository->saveGame(
            $user,
            $this->gameEngine->sanitizeState($gameState)
        );

        $payload['game_state'] = $this->gameEngine->sanitizeState(
            is_array($payload['game_state'] ?? null) ? $payload['game_state'] : []
        );

        return $payload;
    }
}
