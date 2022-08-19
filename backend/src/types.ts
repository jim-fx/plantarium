import type { Project as InternalProject } from "./projects/entities/project.entity";
import type { Report as InternalReport } from "./report/report.entity";
export type { CreateReportDto } from "./report/dto/create-report.dto";
export { User } from "./user/user.entity";
export { Project, Report };

type ReplaceId<T> = Omit<T, "_id"> & { id: string };
export type PaginatedResult<T> = {
  amount: number,
  offset: number,
  result: T
}

type Project = Omit<ReplaceId<InternalProject>, "likes" | "addLike" | "removeLike" | "toJSON"> & { likes: string[] };
type Report = ReplaceId<InternalReport>;


