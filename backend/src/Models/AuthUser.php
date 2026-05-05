<?php

declare(strict_types=1);

namespace App\Models;

final class AuthUser
{
    public readonly string $id;
    public readonly ?string $email;
    public readonly string $username;
    public readonly string $displayName;
    public readonly array $roles;
    public readonly bool $isGuest;
    public readonly string $authType;

    public function __construct(
        string $id,
        ?string $email,
        string $username,
        string $displayName,
        array $roles = [],
        bool $isGuest = false,
        string $authType = 'frontpage'
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->username = $username;
        $this->displayName = $displayName;
        $this->roles = $roles;
        $this->isGuest = $isGuest;
        $this->authType = $authType;
    }

    public static function fromArray(array $data): self
    {
        if (!isset($data['id'])) {
            throw new \RuntimeException('Missing auth user id.');
        }

        return new self(
            (string) $data['id'],
            isset($data['email']) ? (string) $data['email'] : null,
            isset($data['username']) ? (string) $data['username'] : (string) $data['id'],
            isset($data['display_name']) ? (string) $data['display_name'] : (isset($data['username']) ? (string) $data['username'] : (string) $data['id']),
            is_array($data['roles'] ?? null) ? $data['roles'] : [],
            (bool) ($data['is_guest'] ?? false),
            isset($data['auth_type']) ? (string) $data['auth_type'] : 'frontpage'
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'username' => $this->username,
            'display_name' => $this->displayName,
            'roles' => $this->roles,
            'is_guest' => $this->isGuest,
            'auth_type' => $this->authType,
        ];
    }
}
