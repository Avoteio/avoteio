DROP DATABASE IF EXISTS  avoteio;

CREATE DATABASE avoteio;

USE avoteio;

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	`isAccessible` bit NOT NULL DEFAULT 1,
	`user_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` varchar(250) NOT NULL,
	`artist` varchar(250) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
	`spotify_id` varchar(250) DEFAULT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `songs_rooms`;
CREATE TABLE `songs_rooms` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`song_id` INT NOT NULL,
	`room_id` INT NOT NULL,
	`upvote` INT NOT NULL DEFAULT 0,
	`downvote` INT NOT NULL DEFAULT 0,
	`isPlayed` bit NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`spotify_id` varchar(250) NULL DEFAULT NULL,
	`spotify_display_name` varchar(250) NULL DEFAULT NULL,
	`access_token` varchar(1000) NULL DEFAULT NULL,
	`refresh_token` varchar(1000) NULL DEFAULT NULL,
	`token_expires_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `songs_rooms` ADD CONSTRAINT `songs_rooms_fk0` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`);

ALTER TABLE `songs_rooms` ADD CONSTRAINT `songs_rooms_fk1` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`);

ALTER TABLE `rooms` ADD CONSTRAINT `rooms_fk0` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);