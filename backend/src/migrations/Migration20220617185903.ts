import { Migration } from '@mikro-orm/migrations';

export class Migration20220617185903 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `email` text not null, `username` text not null, `role` text not null, `provider` text not null, `provider_id` text not null, `profile_pic` text not null, `hash` text not null, primary key (`_id`));');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');

    this.addSql('create table `report` (`_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `type` text not null, `labels` json not null, `title` text not null, `gh_issue` integer null, `open` integer not null, `description` text null, `stacktrace` text null, `logs` json null, `browser` json null, `user_id` text null, primary key (`_id`));');
  }

}
