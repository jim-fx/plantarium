import { Migration } from '@mikro-orm/migrations';

export class Migration20210903130630 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` rename column `password` to `hash`;');
  }

}
