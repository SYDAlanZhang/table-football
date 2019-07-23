-- These queries are based on a MYSQL database

CREATE DATABASE `tablefootball`;

CREATE TABLE `games` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'time of this game',
  `description` varchar(255) DEFAULT NULL COMMENT 'description of this game',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `playerGame` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playerName` varchar(255) NOT NULL DEFAULT '',
  `gameId` int(11) NOT NULL,
  `winner` tinyint(2) NOT NULL DEFAULT '0' COMMENT 'if this player is the winner of the game',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;