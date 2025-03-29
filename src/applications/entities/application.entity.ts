import { AuditEntity } from 'src/common/entity/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('applications')
export class Application extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  jobId: number;

  @Column()
  appliedDate: Date;
}
