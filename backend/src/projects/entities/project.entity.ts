import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
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

}
