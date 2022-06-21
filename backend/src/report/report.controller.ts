import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'auth/decorators/permissions.decorator';
import { Roles } from 'auth/decorators/roles.decorator';
import { Permission } from 'auth/enums/permission.enum';
import { Role } from 'auth/enums/role.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/role.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Controller('api/report')
@UseGuards(RolesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('/:id')
  public getReportById(@Param('id') id: string) {
    return this.reportService.getById(id);
  }

  @Get()
  public getReports(): Promise<Report[]> {
    return this.reportService.getAll();
  }

  @Delete('/:id')
  @Permissions(Permission['report.delete'])
  public deleteReport(@Param('id') id: string) {
    return this.reportService.deleteReport(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(@Body() createReportDto: CreateReportDto, @Req() request): Promise<Report> {
    console.log({ request });
    return await this.reportService.create(createReportDto, request?.user?.sub);
  }

  @Put('/:id')
  @Roles(Role.ADMIN)
  public updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.updateReport(id, updateReportDto);
  }

  @Put('/:id/publish')
  @Roles(Role.ADMIN)
  public publish(@Param('id') id: string) {
    return this.reportService.publishToGithub(id);
  }

  @Put('/:id/unpublish')
  @Roles(Role.ADMIN)
  public unpublish(@Param('id') id: string) {
    return this.reportService.unpublishFromGithub(id);
  }

  @Get('/labels')
  public listLabels() {
    try {
      return this.reportService.getIssueLabels();
    } catch (err) {
      return []
    }
  }
}
