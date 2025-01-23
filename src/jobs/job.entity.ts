import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column()
  company: string;

  @Column()
  status: string;

  @Column()
  CTCOffered: number;

  @Column()
  link: string;

  @Column({ type: 'date' })
  appliedDate: Date;

  @Column()
  city: string;

  @Column()
  comments: string;

  @Column()
  recruiterName: string;

  @Column()
  recruiterContact: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  description: string;

  @Column()
  qualifications: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date;
}
