PRAGMA foreign_keys=OFF;

CREATE TABLE `__new_insights` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`topic` text NOT NULL,
  	`published_at` text NOT NULL,
  	`excerpt` text NOT NULL,
  	`body` text,
  	`featured` integer DEFAULT false,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

INSERT INTO `__new_insights`("id", "title", "topic", "published_at", "excerpt", "body", "featured", "updated_at", "created_at") SELECT "id", "title", "topic", "published_at", "excerpt", "body", "featured", "updated_at", "created_at" FROM `insights`;

DROP TABLE `insights`;

ALTER TABLE `__new_insights` RENAME TO `insights`;

PRAGMA foreign_keys=ON;

CREATE INDEX `insights_updated_at_idx` ON `insights` (`updated_at`);

CREATE INDEX `insights_created_at_idx` ON `insights` (`created_at`);
