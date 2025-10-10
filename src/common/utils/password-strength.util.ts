export interface PasswordStrengthResult {
    score: number; // 0-4 (0 = very weak, 4 = very strong)
    feedback: string[];
    requirements: {
        minLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasNumbers: boolean;
        hasSpecialChars: boolean;
        maxLength: boolean;
    };
    suggestions: string[];
}

export class PasswordStrengthUtil {
    private static readonly SPECIAL_CHARS = '!@#$%^&*()_+=[]{}|;:,.<>?-';
    private static readonly COMMON_PASSWORDS = [
        'password', 'password123', '123456', 'qwerty', 'abc123', 'letmein',
        'welcome', 'monkey', '1234567890', 'password1', 'admin', 'root'
    ];

    /**
     * Analyze password strength and provide detailed feedback
     * @param password - The password to analyze
     * @param options - Validation options
     */
    static analyzeStrength(
        password: string,
        options: {
            minLength?: number;
            maxLength?: number;
            requireUppercase?: boolean;
            requireLowercase?: boolean;
            requireNumbers?: boolean;
            requireSpecialChars?: boolean;
        } = {}
    ): PasswordStrengthResult {
        const {
            minLength = 8,
            maxLength = 64,
            requireUppercase = true,
            requireLowercase = true,
            requireNumbers = true,
            requireSpecialChars = true,
        } = options;

        const requirements = {
            minLength: password.length >= minLength,
            maxLength: password.length <= maxLength,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: new RegExp(`[${this.SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password),
        };

        const feedback: string[] = [];
        const suggestions: string[] = [];
        let score = 0;

        // Check length
        if (!requirements.minLength) {
            feedback.push(`Password must be at least ${minLength} characters long`);
            suggestions.push('Add more characters to meet minimum length requirement');
        } else if (password.length >= minLength) {
            score += 1;
        }

        if (!requirements.maxLength) {
            feedback.push(`Password must not exceed ${maxLength} characters`);
            suggestions.push('Reduce password length to meet maximum requirement');
        }

        // Check character requirements
        if (requireUppercase && !requirements.hasUppercase) {
            feedback.push('Password must contain at least one uppercase letter (A-Z)');
            suggestions.push('Add uppercase letters like A, B, C');
        } else if (requirements.hasUppercase) {
            score += 0.5;
        }

        if (requireLowercase && !requirements.hasLowercase) {
            feedback.push('Password must contain at least one lowercase letter (a-z)');
            suggestions.push('Add lowercase letters like a, b, c');
        } else if (requirements.hasLowercase) {
            score += 0.5;
        }

        if (requireNumbers && !requirements.hasNumbers) {
            feedback.push('Password must contain at least one number (0-9)');
            suggestions.push('Add numbers like 1, 2, 3');
        } else if (requirements.hasNumbers) {
            score += 0.5;
        }

        if (requireSpecialChars && !requirements.hasSpecialChars) {
            feedback.push('Password must contain at least one special character');
            suggestions.push(`Add special characters like ${this.SPECIAL_CHARS.slice(0, 10)}...`);
        } else if (requirements.hasSpecialChars) {
            score += 0.5;
        }

        // Additional security checks
        if (this.isCommonPassword(password.toLowerCase())) {
            feedback.push('This password is too common and easily guessable');
            suggestions.push('Use a more unique password that\'s not commonly used');
            score = Math.max(0, score - 1);
        }

        if (this.hasRepeatingCharacters(password)) {
            feedback.push('Avoid using repeating characters or patterns');
            suggestions.push('Mix up your characters to avoid patterns like "aaa" or "123"');
            score = Math.max(0, score - 0.5);
        }

        if (this.hasKeyboardPatterns(password)) {
            feedback.push('Avoid keyboard patterns like "qwerty" or "123456"');
            suggestions.push('Use a more random combination of characters');
            score = Math.max(0, score - 0.5);
        }

        // Bonus points for good practices
        if (password.length >= 12) {
            score += 0.5; // Bonus for longer passwords
        }

        if (this.hasGoodMixOfCharacters(password)) {
            score += 0.5; // Bonus for good character diversity
        }

        // Cap the score at 4
        score = Math.min(4, Math.max(0, score));

        // Generate positive feedback for strong passwords
        if (feedback.length === 0) {
            const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Very Strong'];
            const strengthIndex = Math.floor(score);
            feedback.push(`Password strength: ${strengthLabels[strengthIndex] || 'Very Strong'}`);
            
            if (score >= 3) {
                suggestions.push('Great job! Your password meets security requirements.');
            }
        }

        return {
            score: Math.round(score * 10) / 10, // Round to 1 decimal place
            feedback,
            requirements,
            suggestions,
        };
    }

    /**
     * Get a simple strength label for UI display
     */
    static getStrengthLabel(score: number): { label: string; color: string } {
        if (score < 1) return { label: 'Very Weak', color: '#ff4444' };
        if (score < 2) return { label: 'Weak', color: '#ff8800' };
        if (score < 3) return { label: 'Fair', color: '#ffbb00' };
        if (score < 4) return { label: 'Good', color: '#88cc00' };
        return { label: 'Very Strong', color: '#00cc44' };
    }

    /**
     * Check if password is in common passwords list
     */
    private static isCommonPassword(password: string): boolean {
        return this.COMMON_PASSWORDS.includes(password);
    }

    /**
     * Check for repeating characters (3 or more in a row)
     */
    private static hasRepeatingCharacters(password: string): boolean {
        return /(.)\1{2,}/.test(password);
    }

    /**
     * Check for common keyboard patterns
     */
    private static hasKeyboardPatterns(password: string): boolean {
        const patterns = [
            'qwerty', 'asdf', 'zxcv', '123456', '1234567890',
            'abcdef', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'
        ];
        const lowerPassword = password.toLowerCase();
        return patterns.some(pattern => 
            lowerPassword.includes(pattern) || 
            lowerPassword.includes(pattern.split('').reverse().join(''))
        );
    }

    /**
     * Check if password has a good mix of different character types
     */
    private static hasGoodMixOfCharacters(password: string): boolean {
        const charTypes = [
            /[A-Z]/.test(password), // uppercase
            /[a-z]/.test(password), // lowercase
            /\d/.test(password),     // numbers
            new RegExp(`[${this.SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password) // special
        ];
        
        const typeCount = charTypes.filter(Boolean).length;
        return typeCount >= 3 && password.length >= 8;
    }

    /**
     * Generate a secure password suggestion
     */
    static generateSecurePassword(length: number = 12): string {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const allChars = uppercase + lowercase + numbers + special;
        let password = '';
        
        // Ensure at least one character from each category
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        
        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle the password to avoid predictable patterns
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
}
