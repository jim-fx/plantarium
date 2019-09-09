import { Field, Int, ObjectType } from "type-graphql";
import Task from "./Task";

export default class Project {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field(type => [Task])
  tasks: Task[];
}