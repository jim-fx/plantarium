import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { Octokit } from 'octokit';
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

  async create(dto: CreateReportDto): Promise<Report> {
    const report = new Report();

    report.type = dto.type;
    report.title = dto.title;
    report.logs = dto.logs || [];
    report.labels = dto.labels || [];
    report.description = dto.description;
    report.browser = dto.browser;
    report.stacktrace = dto.stacktrace;

    await this.repository.persistAndFlush(report);

    return report;
  }

  async updateReport(reportId: string, dto: UpdateReportDto): Promise<Report> {
    const report = await this.getById(reportId);

    if (dto.labels) {
      report.labels = [...new Set(dto.labels)];
    }

    if (dto.type) {
      report.type = dto.type;
    }

    if (dto.title) {
      report.title = dto.title;
    }

    if ("open" in dto) {
      report.open = dto.open;
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
    const response = await this.octo.request(
      'GET /repos/{owner}/{repo}/labels',
      {
        owner: process.env.GH_ORG,
        repo: process.env.GH_REPO,
      },
    );

    const tags = response.data
      .filter((v) => v.name.startsWith('P:'))
      .map((v) => v.name.replace('P:', ''));

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

    const labels = [
      ...report.labels.map((v) => 'P:' + v),
      report.type === 'bug' && 'bug',
      report.type === 'feat' && 'enhancement',
    ].filter((v) => !!v);

    const result = await this.octo.rest.issues.create({
      owner: process.env.GH_ORG,
      repo: process.env.GH_REPO,
      title: report.title,
      body: `## Description:
${report.description}
      
## Browser
\`\`\`json
${report.browser ? JSON.stringify(report.browser, null, 2) : 'not available'}
\`\`\`

## StackTrace
\`\`\`
${report.stacktrace
          ? report.stacktrace.lines
            .map((line) => `at *${line.methodName}* ${line.file}`)
            .join('\n')
          : ''
        }
\`\`\`

${report.logs.length ? `<details>
<summary><h3>Logs</h3></summary>

\`\`\`log
${report.logs.map(l => {
          const d = new Date(l.date);
          return `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}:${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()} | [${l.scope}] ${l.args[0]}`
        }).join("\n")}
\`\`\`

</details>`: ""}
`,
      labels,
    });

    report.gh_issue = result.data.number;

    await this.repository.persistAndFlush(report);

    return report.gh_issue;
  }

  async getById(id: string) {
    const report = await this.repository.findOne({ _id: id });

    if (!report) {
      throw new NotFoundException();
    }
    return report;
  }

  async getAll(): Promise<Report[]> {
    return this.repository.findAll();
  }
}
