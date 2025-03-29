import { AuditEntity } from 'src/common/entity/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('jobs')
export class Job extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  role: string;

  @Column()
  companyId: number;

  @Column()
  company: string;

  @Column()
  ctcOffered: number;

  @Column()
  status: string;

  @Column()
  jobLink: string;

  @Column({ type: 'date' })
  appliedDate: Date;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  description: string;

  @Column()
  recruiterId: number;
}
