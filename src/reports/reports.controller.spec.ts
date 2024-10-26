import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { NotFoundException } from '@nestjs/common';

const reportQuery = {
  price: 500,
  year: 1980,
  lng: 0,
  lat: 0,
  make: 'toyota',
  model: 'corolla',
  mileage: 100000,
  id: 1,
  approved: false,
};

const user = {
  id: 1,
  email: 'user@test.com',
  password: 'password',
  admin: false,
};

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportsService: Partial<ReportsService>;

  beforeEach(async () => {
    fakeReportsService = {
      getReports: () => {
        return Promise.resolve([reportQuery as Report]);
      },
      create: (report: CreateReportDto, user) => {
        return Promise.resolve({
          ...report,
          id: 1,
          approved: false,
          user,
        } as Report);
      },
      changeApproval: (id: string, approved: boolean) => {
        if (id !== '1') {
          return Promise.reject(new NotFoundException());
        }
        const report = { ...reportQuery, id: parseInt(id), approved };
        return Promise.resolve(report as Report);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: fakeReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getReports returns list of reports', async () => {
    const reports = await controller.getReports();
    expect(reports.length).toEqual(1);
    expect(reports[0].id).toEqual(1);
  });

  it('createReport returns a new report with "id", "admin", "user"', async () => {
    const report = await controller.createReport(reportQuery, user as User);
    expect(report).toEqual({
      ...reportQuery,
      id: 1,
      approved: false,
      user,
    });
  });

  it('approveReport changes existing report approval', async () => {
    const approvalQuery: ApproveReportDto = { approved: true };
    const updatedReport = await controller.approveReport('1', approvalQuery);
    expect(updatedReport.approved).toEqual(true);
  });

  it('approveReport throws an error if report with given id is not found', async () => {
    const approvalQuery: ApproveReportDto = { approved: true };
    await expect(controller.approveReport('2', approvalQuery)).rejects.toThrow(
      NotFoundException,
    );
  });
});
