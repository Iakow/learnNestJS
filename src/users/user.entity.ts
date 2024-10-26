import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Report } from '../reports/report.entity';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @BeforeInsert()
  beforeInsertAction() {
    if (this.email === configService.get('INITIAL_ADMIN_EMAIL')) {
      this.admin = true;
    }
  }

  @AfterInsert()
  logInsert() {
    // console.log('Inserted User with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    // console.log('Updated User with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    // console.log('Removed User with id ', this.id);
  }
}
