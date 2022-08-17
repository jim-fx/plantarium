import type { Project } from "@plantarium/types";

export class CreateProjectDto {
  meta: Project["meta"]
  nodes: Project["nodes"]
}
