import { Migration } from '@mikro-orm/migrations';

export class Migration20220516220618 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `email` text not null, `username` text not null, `role` text check (`role` in (\'admin\', \'user\', \'anon\')) not null, `hash` text not null, primary key (`id`));');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');

    this.addSql('create table `report` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `type` text not null, `labels` json not null, `title` text not null, `gh_issue` integer null, `open` integer not null, `description` text null, `stacktrace` text null, `browser` json null, `user_id` text null, primary key (`id`));');
  }

}
