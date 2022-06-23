import { Migration } from '@mikro-orm/migrations';

export class Migration20220623142326 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index `project_author__id_unique`;');
  }

}
