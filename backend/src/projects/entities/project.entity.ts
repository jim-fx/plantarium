import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import type { Project as IProject } from "@plantarium/types";
import { BaseEntity } from "../../entities/BaseEntity";
import { User } from "../../user/user.entity";

export enum ProjectType {
  OFFICIAL = 2,
  APPROVED = 1,
  USER = 0,
}

@Entity()
export class Project extends BaseEntity {

  @ManyToOne()
  public author: User;
  @Property()
  public public = true;

  @Property({ default: ProjectType.USER })
  public type: ProjectType = 0;

  @ManyToMany({ serializer: u => u.toArray().map((u: User) => u["id"]) })
  public likes = new Collection<User>(this);

  @Property({ type: "json" })
  public meta: IProject["meta"];

  @Property({ type: "json" })
  public nodes: IProject["nodes"];

  public addLike(u: User) {
    if (!this.likes.contains(u)) {
      this.likes.add(u);
    }
  }

  public removeLike(u: User) {
    this.likes.remove(u);
  }

}
