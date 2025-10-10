import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    private readonly saltRounds = 12; // Higher salt rounds for better security

    /**
     * Hash a plain text password using bcrypt
     * @param password - The plain text password to hash
     * @returns Promise<string> - The hashed password
     */
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Compare a plain text password with a hashed password
     * @param password - The plain text password
     * @param hashedPassword - The hashed password to compare against
     * @returns Promise<boolean> - True if passwords match, false otherwise
     */
    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Generate a secure random salt (optional - bcrypt handles this internally)
     * @returns Promise<string> - A random salt
     */
    async generateSalt(): Promise<string> {
        return await bcrypt.genSalt(this.saltRounds);
    }
}
