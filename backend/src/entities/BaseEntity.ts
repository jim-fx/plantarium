import { Entity, PrimaryKey, Property, wrap } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  _id: string = v4();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();


  toJSON(strict = true, strip = [], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args); // do not forget to pass rest params here

    if (strict) {
      strip.forEach(k => delete o[k]);
    }

    if (o["_id"]) {
      const id = o["_id"];
      delete o["_id"]
      o["id"] = id;
    }

    if (typeof o["data"] === "string") {
      o["data"] = JSON.parse(o["data"]);
    }

    return o;
  }
}
