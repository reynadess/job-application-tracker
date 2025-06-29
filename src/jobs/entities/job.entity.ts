import { Column, Entity } from 'typeorm';
import { AuditEntity } from '../../common/entity/audit.entity';
import { JobStatus } from '../job-status.enum';
import { CreateApplicationDto } from 'src/applications/dto/create-application.dto';

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

    
    static fromApplication(application: CreateApplicationDto): Job {
        let jobEntity = new Job();
        jobEntity.role = application.role;
        jobEntity.company = application.company;
        jobEntity.jobLink = application.jobLink;
        jobEntity.city = application.city;
        jobEntity.state = application.state;
        jobEntity.country = application.country;
        jobEntity.description = application.description;
        jobEntity.ctcOffered = application.ctcOffered;
        jobEntity.status = JobStatus.Open;

        return jobEntity;
    }
}
