<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\DaemonGameEngine;

final class GameIntentAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly DaemonGameEngine $gameEngine
    ) {
    }

    public function execute(AuthUser $user, string $actionType, array $body): array
    {
        $currentPayload = $this->gameRepository->loadOrCreateState(
            $user,
            $this->gameEngine->initialState()
        );

        $currentState = is_array($currentPayload['game_state'] ?? null)
            ? $currentPayload['game_state']
            : $this->gameEngine->initialState();

        $nextState = $this->gameEngine->applyAction(
            $actionType,
            $this->gameEngine->sanitizeState($currentState),
            $body
        );

        $payload = $this->gameRepository->replaceGameState(
            $user,
            $this->gameEngine->sanitizeState($nextState)
        );

        $payload['game_state'] = $this->gameEngine->sanitizeState(
            is_array($payload['game_state'] ?? null) ? $payload['game_state'] : []
        );

        return $payload;
    }
}
