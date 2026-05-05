<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\DaemonGameEngine;

final class LoadGameAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly DaemonGameEngine $gameEngine
    ) {
    }

    public function execute(AuthUser $user): array
    {
        $payload = $this->gameRepository->loadOrCreateState(
            $user,
            $this->gameEngine->initialState()
        );

        $payload['game_state'] = $this->gameEngine->sanitizeState(
            is_array($payload['game_state'] ?? null) ? $payload['game_state'] : []
        );

        return $payload;
    }
}
