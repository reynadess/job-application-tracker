import { Column, Entity } from 'typeorm';
import { AuditEntity } from '../common/entity/audit.entity';
import { JobStatus } from './job-status.enum';

@Entity('jobs')
export class Job extends AuditEntity {
    @Column({ nullable: false })
    role: string;

    @Column()
    companyId: number;

    @Column()
    company: string;

    @Column()
    ctcOffered: number;

    @Column({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.Open,
        nullable: false,
    })
    status: string;

    @Column()
    jobLink: string;

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
