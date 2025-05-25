import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { AuditEntity } from '../common/entity/audit.entity';

@Entity('applicants')
export class Applicant extends AuditEntity {
    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;
}
