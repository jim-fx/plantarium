import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import type { Project as IProject } from "@plantarium/types";
import { User } from "user/user.entity";
import { BaseEntity } from "../../entities/BaseEntity";

export enum ProjectType {
  OFFICIAL = 2,
  APPROVED = 1,
  USER = 0,
}

@Entity()
export class Project extends BaseEntity implements IProject {

  @ManyToOne()
  //@ts-ignore we can ignore this
  public author: User;

  @Property()
  public public = true;

  @Property({ default: ProjectType.USER })
  public type: ProjectType = 0;

  @ManyToMany({ serializer: u => u.toArray().map((u: User) => u._id) })
  //@ts-ignore
  public likes = new Collection<User>(this);

  @Property()
  public meta: IProject["meta"];

  @Property()
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
