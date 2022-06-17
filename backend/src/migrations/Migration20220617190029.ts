import { Migration } from '@mikro-orm/migrations';

export class Migration20220617190029 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter218` (`_id` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `email` text NOT NULL, `username` text NOT NULL, `role` text NOT NULL, `provider` text, `provider_id` text, `profile_pic` text, `hash` text NOT NULL, PRIMARY KEY (`_id`));');
    this.addSql('INSERT INTO "_knex_temp_alter218" SELECT * FROM "user";;');
    this.addSql('DROP TABLE "user";');
    this.addSql('ALTER TABLE "_knex_temp_alter218" RENAME TO "user";');
    this.addSql('CREATE UNIQUE INDEX `user_email_unique` on `user` (`email`);');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
