import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const reportQuery = {
  price: 500,
  year: 1980,
  lng: 0,
  lat: 0,
  make: 'toyota',
  model: 'corolla',
  mileage: 100000,
};

describe('Reports', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a request to create a new report', async () => {
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'user1@test.com', password: 'password' });
    const cookie = signupRes.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .post('/reports')
      .send(reportQuery)
      .set('Cookie', cookie)
      .expect(201);

    expect(body.id).toEqual(1);
    expect(body.userId).toEqual(1);
    expect(body.approved).toEqual(false);
  });

  it('handles a request to get all reports for admin', async () => {
    // create admin
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: configService.get('INITIAL_ADMIN_EMAIL'),
        password: 'password',
      });
    const cookie = signupRes.get('Set-Cookie');

    // create report
    await request(app.getHttpServer())
      .post('/reports')
      .send(reportQuery)
      .set('Cookie', cookie)
      .expect(201);

    //get reports
    const reportsRes = await request(app.getHttpServer())
      .get('/reports')
      .set('Cookie', cookie)
      .expect(200);

    expect(reportsRes.body).toHaveLength(1);
    expect(reportsRes.body[0].id).toEqual(1);
    expect(reportsRes.body[0].approved).toEqual(false);
  });

  it('handles a request to approve a report by admin', async () => {
    // create admin
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: configService.get('INITIAL_ADMIN_EMAIL'),
        password: 'password',
      });
    const cookie = signupRes.get('Set-Cookie');

    // create report
    await request(app.getHttpServer())
      .post('/reports')
      .send(reportQuery)
      .set('Cookie', cookie)
      .expect(201);

    const approvalRes = await request(app.getHttpServer())
      .patch('/reports/1')
      .send({ approved: true })
      .set('Cookie', cookie)
      .expect(200);

    expect(approvalRes.body.approved).toEqual(true);
  });

  it('handles a request to get an estimate for a report', async () => {
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'user1@test.com', password: 'password' });
    const cookie = signupRes.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/reports/estimate')
      .query(reportQuery)
      .set('Cookie', cookie)
      .expect(200);

    expect(body.price).toEqual(null); // no approved reports
  });
});
