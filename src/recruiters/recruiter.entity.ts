import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  company: string;
}
