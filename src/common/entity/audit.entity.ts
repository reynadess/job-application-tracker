import { Exclude } from 'class-transformer';
import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class AuditEntity {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt: Date | null; // Soft delete column
}
