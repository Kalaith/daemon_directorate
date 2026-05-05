<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\SystemController;
use App\Middleware\WebHatcheryJwtMiddleware;

return static function (\App\Core\Router $router): void {
    $auth = [WebHatcheryJwtMiddleware::class];

    $router->get('/api/health', [SystemController::class, 'health']);
    $router->get('/api/auth/login-info', [AuthController::class, 'loginInfo']);
    $router->post('/api/auth/guest-session', [AuthController::class, 'guestSession']);
    $router->post('/api/auth/link-guest', [AuthController::class, 'linkGuest'], $auth);

    $router->get('/api/game', [GameController::class, 'current'], $auth);
    $router->post('/api/game/start', [GameController::class, 'start'], $auth);
    $router->post('/api/game/save', [GameController::class, 'save'], $auth);
    $router->post('/api/game/action/{action_type}', [GameController::class, 'action'], $auth);
};
