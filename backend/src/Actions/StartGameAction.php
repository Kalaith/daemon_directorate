<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\DaemonGameEngine;
use DomainException;

final class StartGameAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly DaemonGameEngine $gameEngine
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $initialState = $this->gameEngine->initialState();
        if (array_key_exists('state', $body)) {
            if (!is_array($body['state'])) {
                throw new DomainException('start payload must include a state object when provided.');
            }

            $initialState = $this->gameEngine->mergeState($initialState, $body['state']);
        }

        $payload = $this->gameRepository->replaceGameState(
            $user,
            $this->gameEngine->sanitizeState($initialState)
        );

        $payload['game_state'] = $this->gameEngine->sanitizeState(
            is_array($payload['game_state'] ?? null) ? $payload['game_state'] : []
        );

        return $payload;
    }
}
