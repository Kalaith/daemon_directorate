<?php

declare(strict_types=1);

namespace App\Core;

use App\Actions\GameIntentAction;
use App\Actions\LoadGameAction;
use App\Actions\LinkGuestAccountAction;
use App\Actions\SaveGameAction;
use App\Actions\StartGameAction;
use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\SystemController;
use App\Repositories\GameRepository;
use App\Services\DaemonGameEngine;
use PDO;
use RuntimeException;

final class ServiceFactory
{
    private ?PDO $db = null;
    private ?GameRepository $gameRepository = null;
    private ?DaemonGameEngine $gameEngine = null;

    public function create(string $class): object
    {
        return match ($class) {
            SystemController::class => new SystemController(),
            AuthController::class => new AuthController(new LinkGuestAccountAction($this->gameRepository())),
            GameController::class => new GameController(
                new LoadGameAction($this->gameRepository(), $this->gameEngine()),
                new StartGameAction($this->gameRepository(), $this->gameEngine()),
                new SaveGameAction($this->gameRepository(), $this->gameEngine()),
                new GameIntentAction($this->gameRepository(), $this->gameEngine())
            ),
            default => throw new RuntimeException('Unknown class ' . $class),
        };
    }

    private function gameRepository(): GameRepository
    {
        if ($this->gameRepository instanceof GameRepository) {
            return $this->gameRepository;
        }

        $this->gameRepository = new GameRepository($this->db());
        return $this->gameRepository;
    }

    private function gameEngine(): DaemonGameEngine
    {
        if ($this->gameEngine instanceof DaemonGameEngine) {
            return $this->gameEngine;
        }

        $this->gameEngine = new DaemonGameEngine();
        return $this->gameEngine;
    }

    private function db(): PDO
    {
        if ($this->db instanceof PDO) {
            return $this->db;
        }

        $this->db = Database::getConnection();
        return $this->db;
    }
}
