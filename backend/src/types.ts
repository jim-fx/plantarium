export type { Project } from "./projects/entities/project.entity"
export type { CreateReportDto } from "./report/dto/create-report.dto"
export type { Report } from "./report/report.entity"
export { User }
import { User as InternalUser } from "./user/user.entity"

interface User extends Omit<InternalUser, "likes"> {
  likes: string[]
}

export type PaginatedResult<T> = {
  amount: number,
  offset: number,
  result: T
}
