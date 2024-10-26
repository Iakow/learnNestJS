import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';

const validReportRequest: CreateReportDto = {
  price: 500,
  year: 1980,
  lng: 0,
  lat: 0,
  make: 'toyota',
  model: 'corolla',
  mileage: 100000,
};

const user = {
  id: 1,
  email: 'user@test.com',
  password: 'password',
  admin: false,
};

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const reports: any[] = [];

    const mockReportRepository = () => ({
      find: () => reports,
      // createQueryBuilder: jest.fn(() => ({
      //   select: jest.fn().mockReturnThis(),
      //   where: jest.fn().mockReturnThis(),
      //   andWhere: jest.fn().mockReturnThis(),
      //   orderBy: jest.fn().mockReturnThis(),
      //   setParameters: jest.fn().mockReturnThis(),
      //   limit: jest.fn().mockReturnThis(),
      //   getRawOne: jest.fn(),
      // })),
      create: (report: CreateReportDto) => ({ ...report }),
      save: (report: CreateReportDto & { id?: number }) => {
        const indexOfExistingReport = reports.findIndex(
          (r) => r.id === report.id,
        );

        if (indexOfExistingReport !== -1) {
          reports[indexOfExistingReport] = report;
          return report;
        } else {
          const newReport = {
            ...report,
            approved: false,
            id: reports.length + 1,
          };
          reports.push(newReport);
          return newReport;
        }
      },
      findOne: (query: any) => {
        return reports.find((report) => report.id === parseInt(query.where.id));
      },
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useFactory: mockReportRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crates report with additional "id", "user", "approved" fields', async () => {
    const result = await service.create(validReportRequest, user as User);
    expect(result).toEqual({
      ...validReportRequest,
      id: 1,
      approved: false,
      user,
    });
  });

  it('returns an array of reports', async () => {
    await service.create(validReportRequest, user as User);
    const result = await service.getReports();
    expect(result).toEqual([
      {
        ...validReportRequest,
        id: 1,
        approved: false,
        user,
      },
    ]);
  });

  it('returns empty array if no reports', async () => {
    expect(await service.getReports()).toEqual([]);
  });

  it('changes approval status of existing report', async () => {
    const report = await service.create(validReportRequest, user as User);
    const result = await service.changeApproval(report.id.toString(), true);
    expect(result).toEqual({ ...report, approved: true });
  });

  it('rejects changing approval status of non-existing report', async () => {
    await expect(service.changeApproval('fail', true)).rejects.toThrow();
  });
});
