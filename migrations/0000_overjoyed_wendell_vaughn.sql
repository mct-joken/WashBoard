CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`role` integer DEFAULT 1,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);

CREATE TABLE `laundries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer,
	`running` integer DEFAULT false,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`place` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);

CREATE TABLE `useHistories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`accountId` integer,
	`laundryId` integer,
	`startAt` integer NOT NULL,
	`endAt` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`laundryId`) REFERENCES `laundries`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `uses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`accountId` integer,
	`laundryId` integer,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`laundryId`) REFERENCES `laundries`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);
CREATE UNIQUE INDEX `emailIdx` ON `accounts` (`email`);
CREATE UNIQUE INDEX `rooms_place_unique` ON `rooms` (`place`);