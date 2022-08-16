import { Collection, Entity, ManyToMany, ManyToOne, Property, wrap } from "@mikro-orm/core";
import type { PlantProject } from "@plantarium/types";
import { User } from "user/user.entity";
import { BaseEntity } from "../../entities/BaseEntity";

export enum ProjectType {
  OFFICIAL = 2,
  APPROVED = 1,
  USER = 0,
}

@Entity()
export class Project extends BaseEntity {

  @Property()
  public plantId: string;

  @ManyToOne()
  public author: User;

  @Property({ default: ProjectType.USER })
  public type: ProjectType = 0;

  @ManyToMany({ serializer: u => u.toArray().map((u: User) => u._id) })
  public likes = new Collection<User>(this);

  @Property()
  public data: PlantProject;

  public addLike(u: User) {
    if (!this.likes.contains(u)) {
      this.likes.add(u);
    }
  }

  public removeLike(u: User) {
    this.likes.remove(u);
  }


  toJSON(strict = true, strip = ['id', 'email'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args); // do not forget to pass rest params here

    if (strict) {
      strip.forEach(k => delete o[k]);
    }

    if (typeof o["data"] === "string") {
      o["data"] = JSON.parse(o["data"]);
    }

    return o;
  }


}
