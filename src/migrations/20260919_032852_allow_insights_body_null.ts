import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_insights\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`topic\` text NOT NULL,
  	\`published_at\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`body\` text,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_insights\`("id", "title", "topic", "published_at", "excerpt", "body", "featured", "updated_at", "created_at") SELECT "id", "title", "topic", "published_at", "excerpt", "body", "featured", "updated_at", "created_at" FROM \`insights\`;`)
  await db.run(sql`DROP TABLE \`insights\`;`)
  await db.run(sql`ALTER TABLE \`__new_insights\` RENAME TO \`insights\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`insights_updated_at_idx\` ON \`insights\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`insights_created_at_idx\` ON \`insights\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_insights\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`topic\` text NOT NULL,
  	\`published_at\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_insights\`("id", "title", "topic", "published_at", "excerpt", "body", "featured", "updated_at", "created_at") SELECT "id", "title", "topic", "published_at", "excerpt", "body", "featured", "updated_at", "created_at" FROM \`insights\`;`)
  await db.run(sql`DROP TABLE \`insights\`;`)
  await db.run(sql`ALTER TABLE \`__new_insights\` RENAME TO \`insights\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`insights_updated_at_idx\` ON \`insights\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`insights_created_at_idx\` ON \`insights\` (\`created_at\`);`)
}
