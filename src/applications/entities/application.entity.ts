import { AuditEntity } from 'src/common/entity/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationStatus } from '../application-status.enum';

@Entity('applications')
export class Application extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  status: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.Apply,
    nullable: false,
  })
  userId: ApplicationStatus;

  @Column({ nullable: false })
  jobId: number;

  @Column()
  appliedDate: Date;
}
