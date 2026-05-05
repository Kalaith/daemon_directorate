CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    roles_json JSON NOT NULL,
    auth_type VARCHAR(64) NOT NULL DEFAULT 'frontpage',
    is_guest TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    last_seen_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS game_saves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id VARCHAR(255) NOT NULL,
    game_state_json JSON NOT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY unique_player_save (auth_user_id),
    INDEX idx_auth_user_id (auth_user_id),
    CONSTRAINT fk_game_saves_players
        FOREIGN KEY (auth_user_id)
        REFERENCES players (auth_user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
