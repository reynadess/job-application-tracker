import { AuditEntity } from 'src/common/entities/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
