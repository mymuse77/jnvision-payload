CREATE TABLE `solutions_highlights` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`text` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `solutions`(`id`) ON UPDATE no action ON DELETE cascade
  );

CREATE INDEX `solutions_highlights_order_idx` ON `solutions_highlights` (`_order`);

CREATE INDEX `solutions_highlights_parent_id_idx` ON `solutions_highlights` (`_parent_id`);

CREATE TABLE `solutions` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`sector` text NOT NULL,
  	`eyebrow` text,
  	`summary` text NOT NULL,
  	`order` numeric DEFAULT 10,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

CREATE INDEX `solutions_updated_at_idx` ON `solutions` (`updated_at`);

CREATE INDEX `solutions_created_at_idx` ON `solutions` (`created_at`);

CREATE TABLE `products_capabilities` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`text` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
  );

CREATE INDEX `products_capabilities_order_idx` ON `products_capabilities` (`_order`);

CREATE INDEX `products_capabilities_parent_id_idx` ON `products_capabilities` (`_parent_id`);

CREATE TABLE `products` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`english_title` text,
  	`category` text NOT NULL,
  	`summary` text NOT NULL,
  	`order` numeric DEFAULT 10,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

CREATE INDEX `products_updated_at_idx` ON `products` (`updated_at`);

CREATE INDEX `products_created_at_idx` ON `products` (`created_at`);

CREATE TABLE `insights` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`topic` text NOT NULL,
  	`published_at` text NOT NULL,
  	`excerpt` text NOT NULL,
  	`body` text NOT NULL,
  	`featured` integer DEFAULT false,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

CREATE INDEX `insights_updated_at_idx` ON `insights` (`updated_at`);

CREATE INDEX `insights_created_at_idx` ON `insights` (`created_at`);

CREATE TABLE `inquiries` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`phone` text NOT NULL,
  	`email` text,
  	`message` text NOT NULL,
  	`status` text DEFAULT 'new',
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );

CREATE INDEX `inquiries_updated_at_idx` ON `inquiries` (`updated_at`);

CREATE INDEX `inquiries_created_at_idx` ON `inquiries` (`created_at`);

CREATE TABLE `payload_kv` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`key` text NOT NULL,
  	`data` text NOT NULL
  );

CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);

CREATE TABLE `site_settings` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`company_name` text DEFAULT '北京捷诺视讯数码科技有限公司' NOT NULL,
  	`hero_title` text DEFAULT '让每一个复杂场景，都拥有清晰的数字视野' NOT NULL,
  	`company_intro` text DEFAULT '公司成立于1997年，注册资金1500万，是国内领先的智能化软件平台开发商和解决方案提供商。' NOT NULL,
  	`phone` text DEFAULT '010-58851134/5/6/7/8' NOT NULL,
  	`fax` text DEFAULT '010-58851134-209',
  	`address` text DEFAULT '北京市海淀区上地东路一号盈创动力E座504室' NOT NULL,
  	`icp` text DEFAULT '京ICP备14042411号-1',
  	`updated_at` text,
  	`created_at` text
  );

ALTER TABLE `payload_locked_documents_rels` ADD `solutions_id` integer REFERENCES solutions(id);

ALTER TABLE `payload_locked_documents_rels` ADD `products_id` integer REFERENCES products(id);

ALTER TABLE `payload_locked_documents_rels` ADD `insights_id` integer REFERENCES insights(id);

ALTER TABLE `payload_locked_documents_rels` ADD `inquiries_id` integer REFERENCES inquiries(id);

CREATE INDEX `payload_locked_documents_rels_solutions_id_idx` ON `payload_locked_documents_rels` (`solutions_id`);

CREATE INDEX `payload_locked_documents_rels_products_id_idx` ON `payload_locked_documents_rels` (`products_id`);

CREATE INDEX `payload_locked_documents_rels_insights_id_idx` ON `payload_locked_documents_rels` (`insights_id`);

CREATE INDEX `payload_locked_documents_rels_inquiries_id_idx` ON `payload_locked_documents_rels` (`inquiries_id`);
