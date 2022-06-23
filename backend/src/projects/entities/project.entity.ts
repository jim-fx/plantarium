import { Collection, Entity, Index, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { PlantProject } from "@plantarium/types";
import { Exclude, Expose } from "class-transformer";
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
  @Index()
  public plantId: string;

  @Index()
  @ManyToOne()
  public author: User;

  @Property({ default: ProjectType.USER })
  public type: ProjectType = 0;

  @Exclude()
  @ManyToMany()
  public _likes = new Collection<User>(this);

  @Expose()
  get likes(): number {
    return this._likes.length;
  }

  @Property()
  public data: PlantProject;


  public addLike(u: User) {
    if (!this._likes.contains(u)) {
      this._likes.add(u);
    }
  }

  public removeLike(u: User) {
    this._likes.remove(u);
  }


}
