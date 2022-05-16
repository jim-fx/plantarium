import { Migration } from '@mikro-orm/migrations';

export class Migration20210902181719 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `report` (`id` varchar not null, `created_at` datetime not null, `updated_at` datetime not null, `type` varchar not null, `open` integer not null, `description` varchar null, `stacktrace` varchar null, `browser` varchar null, `user_id` varchar null, primary key (`id`));',
    );
  }
}
