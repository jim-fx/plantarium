import { Entity, Index, OneToOne, Property } from "@mikro-orm/core";
import { User } from "user/user.entity";
import { BaseEntity } from "../../entities/BaseEntity";


@Entity()
export class Project extends BaseEntity {

  @Property()
  @Index()
  public plantId: string;

  @Property()
  public data: string;

  @Property()
  public meta: string;

  @OneToOne({ orphanRemoval: true })
  public author: User;

}
