CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` integer DEFAULT 1,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);

CREATE TABLE `laundries` (
	`id` text PRIMARY KEY NOT NULL,
	`roomId` text,
	`running` integer DEFAULT false,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`place` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);

CREATE TABLE `useHistories` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text,
	`laundryId` text,
	`startAt` integer NOT NULL,
	`endAt` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`laundryId`) REFERENCES `laundries`(`id`) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE `uses` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text,
	`laundryId` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`laundryId`) REFERENCES `laundries`(`id`) ON UPDATE cascade ON DELETE cascade
);

CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);
CREATE UNIQUE INDEX `rooms_place_unique` ON `rooms` (`place`);