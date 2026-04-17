import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { AuditEntity } from '../common/entity/audit.entity';
import * as bcrypt from 'bcrypt';

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

    @Column()
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        // Hash the password before saving to the database
        if (this.password) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }

    @Column()
    refreshToken: string;
}
