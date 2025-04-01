import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditEntity } from '../../common/entity/audit.entity';
import { ApplicationStatus } from '../application-status.enum';

@Entity('applications')
export class Application extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.Apply,
    nullable: false,
  })
  status: ApplicationStatus; // FIXME Default Enum not applied.

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  jobId: number;

  @Column()
  appliedDate: Date;
}
