<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GameIntentAction;
use App\Actions\LoadGameAction;
use App\Actions\SaveGameAction;
use App\Actions\StartGameAction;
use App\Core\Request;
use App\Core\Response;
use App\Models\AuthUser;

final class GameController
{
    public function __construct(
        private readonly LoadGameAction $loadGameAction,
        private readonly StartGameAction $startGameAction,
        private readonly SaveGameAction $saveGameAction,
        private readonly GameIntentAction $gameIntentAction
    ) {
    }

    public function current(Request $request, Response $response): void
    {
        $response->success($this->loadGameAction->execute(
            AuthUser::fromArray($request->getAttribute('auth_user', []))
        ));
    }

    public function start(Request $request, Response $response): void
    {
        $response->success($this->startGameAction->execute(
            AuthUser::fromArray($request->getAttribute('auth_user', [])),
            $request->getBody()
        ));
    }

    public function save(Request $request, Response $response): void
    {
        $response->success($this->saveGameAction->execute(
            AuthUser::fromArray($request->getAttribute('auth_user', [])),
            $request->getBody()
        ));
    }

    public function action(Request $request, Response $response): void
    {
        $response->success($this->gameIntentAction->execute(
            AuthUser::fromArray($request->getAttribute('auth_user', [])),
            (string) $request->getAttribute('action_type', ''),
            $request->getBody()
        ));
    }
}
