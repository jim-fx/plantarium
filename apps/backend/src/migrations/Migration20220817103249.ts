import { Migration } from '@mikro-orm/migrations';

export class Migration20220817103249 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `email` text not null, `username` text not null, `role` text not null, `provider` text null, `provider_id` text null, `profile_pic` text null, `hash` text null, primary key (`_id`));');
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');

    this.addSql('create table `report` (`_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `type` text not null, `labels` json not null, `author__id` text null, `title` text not null, `gh_issue` integer null, `open` integer not null, `description` text null, `stacktrace` text null, `logs` json null, `browser` json null, constraint `report_author__id_foreign` foreign key(`author__id`) references `user`(`_id`) on delete set null on update cascade, primary key (`_id`));');
    this.addSql('create unique index `report_author__id_unique` on `report` (`author__id`);');

    this.addSql('create table `project` (`_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `author__id` text not null, `public` integer not null, `type` text not null default 0, `meta` text not null, `nodes` text not null, constraint `project_author__id_foreign` foreign key(`author__id`) references `user`(`_id`) on update cascade, primary key (`_id`));');
    this.addSql('create index `project_author__id_index` on `project` (`author__id`);');

    this.addSql('create table `project_likes` (`project__id` text not null, `user__id` text not null, constraint `project_likes_project__id_foreign` foreign key(`project__id`) references `project`(`_id`) on delete cascade on update cascade, constraint `project_likes_user__id_foreign` foreign key(`user__id`) references `user`(`_id`) on delete cascade on update cascade, primary key (`project__id`, `user__id`));');
    this.addSql('create index `project_likes_project__id_index` on `project_likes` (`project__id`);');
    this.addSql('create index `project_likes_user__id_index` on `project_likes` (`user__id`);');
  }

}
