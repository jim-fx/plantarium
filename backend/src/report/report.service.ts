import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { Octokit, App } from "octokit";
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {

  private octo: Octokit;

  constructor(
    @InjectRepository(Report)
    private readonly repository: EntityRepository<Report>,
  ) {
    this.octo = new Octokit({ auth: process.env.GH_TOKEN });
  }

	create(dto: CreateReportDto): Report {
		const report = new Report();

    report.browser = dto.browser;
    report.type = dto.type;
    report.description = dto.description;
    report.stacktrace = dto.stacktrace;
    report.title = dto.title;
    report.labels = dto.labels || [];

    this.repository.persistAndFlush(report);

    return report;
  }

  async updateReport(reportId: string, dto: UpdateReportDto): Promise<Report> {
    const report = await this.getById(reportId);

    console.log("UPDATE REPORT", reportId)
    console.log(report);

    if (dto.labels) {
      report.labels = [...new Set(dto.labels)];
    }

    if (dto.type) {
      report.type = dto.type;
    }

    if (dto.title) {
      report.title = dto.title;
    }

    if (dto.description) {
      report.description = dto.description;
    }

    await this.repository.persistAndFlush(report);

    return report;
  }

  async deleteReport(id: string) {
    const report = await this.getById(id);
    return this.repository.removeAndFlush(report);
  }

  async getIssueLabels(): Promise<any> {
    const response = await this.octo.request('GET /repos/{owner}/{repo}/labels', {
      owner: process.env.GH_ORG,
      repo: process.env.GH_REPO,
    })

    const tags = response.data.filter(v => v.name.startsWith("P:")).map(v => v.name.replace("P:", ""));

    return tags;
  }

  async unpublishFromGithub(id: string) {
    const report = await this.getById(id);

    if (!report.gh_issue) {
      return null;
    }

    report.gh_issue = null;
    await this.repository.persistAndFlush(report);
    return null;
  }

  async publishToGithub(id: string) {
    const report = await this.getById(id);

    if (report.gh_issue) {
      throw new ConflictException();
    }

    const labels = [...report.labels.map(v => "P:" + v), report.type === "bug" && "bug", report.type === "feat" && "enhancement"].filter(v => !!v);

    const result = await this.octo.rest.issues.create({
      owner: process.env.GH_ORG,
      repo: process.env.GH_REPO,
      title: report.title,
      body: `## Description:
${report.description}
      
## Browser
\`\`\`json
${report.browser ? JSON.stringify(report.browser, null, 2) : "not available"}
\`\`\`

## StackTrace
\`\`\`
${report.stacktrace ? report.stacktrace.lines.map(line => `at *${line.name}* ${line.location}`).join("\n") : ""}
\`\`\``,
      labels
    });

    report.gh_issue = result.data.number;

    await this.repository.persistAndFlush(report);

    return report.gh_issue;

  }

  async getById(id: string) {
    const report = await this.repository.findOne({ id });

    if (!report) {
      throw new NotFoundException();
    }
    return report;
  }

  async getAll(): Promise<Report[]> {
    return this.repository.findAll();
  }
}
