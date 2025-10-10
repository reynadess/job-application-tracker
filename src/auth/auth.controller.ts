import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { 
    ApiBearerAuth, 
    ApiBody, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger';
import {
    CreateApplicantDto,
    LoginApplicantDTO,
} from '../applicants/applicant.dto';
import { PasswordStrengthResult, PasswordStrengthUtil } from '../common/utils/password-strength.util';
import { ReturnAuthDTO } from './auth.dto';
import { JwtRefreshStrategy, LocalAuthGuard } from './auth.guard';
import { BaseAuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: BaseAuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({
        summary: 'User login',
        description: 'Authenticate user with username and password to receive access and refresh tokens'
    })
    @ApiBody({ 
        type: LoginApplicantDTO,
        description: 'User login credentials',
        examples: {
            example1: {
                summary: 'Standard login',
                value: {
                    username: 'johndoe123',
                    password: 'MySecureP@ssw0rd!'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: ReturnAuthDTO,
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', description: 'JWT access token' },
                refresh_token: { type: 'string', description: 'JWT refresh token' }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Invalid credentials' }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    async login(@Request() req): Promise<ReturnAuthDTO> {
        this.logger.log(`Login request for User: ${req.user.username}`);
        return await this.authService.login(req.user);
    }

    @Post('register')
    @ApiOperation({
        summary: 'User registration',
        description: 'Create a new user account with comprehensive validation and security checks'
    })
    @ApiBody({ 
        type: CreateApplicantDto,
        description: 'User registration details',
        examples: {
            example1: {
                summary: 'Complete registration',
                value: {
                    username: 'johndoe123',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'MySecureP@ssw0rd!'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Registration successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Registration successful' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Validation errors',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { 
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Password must be 8-64 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character']
                },
                error: { type: 'string', example: 'Bad Request' }
            }
        }
    })
    @ApiResponse({
        status: 409,
        description: 'Username or email already exists',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 409 },
                message: { type: 'string', example: 'Applicant with username johndoe123 or email john.doe@example.com already exists' }
            }
        }
    })
    @HttpCode(HttpStatus.CREATED)
    @Public()
    async register(@Body() user: CreateApplicantDto): Promise<{ message: string }> {
        this.logger.log(`Register request for User: ${user.username}`);
        await this.authService.register(user);
        return { message: 'Registration successful' };
    }

    @Post('logout')
    @ApiOperation({
        summary: 'User logout',
        description: 'Logout user and invalidate refresh token'
    })
    @ApiResponse({
        status: 200,
        description: 'Logout successful',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Logout successful' }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing token'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req): Promise<{ message: string }> {
        await this.authService.logout(req.user.id);
        return { message: 'Logout successful' };
    }

    @Post('validate-password')
    @ApiOperation({
        summary: 'Validate password strength',
        description: 'Check password strength and get detailed feedback for improving security'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                password: { 
                    type: 'string', 
                    description: 'Password to validate',
                    example: 'MySecureP@ssw0rd!'
                }
            },
            required: ['password']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Password strength analysis',
        schema: {
            type: 'object',
            properties: {
                score: { type: 'number', description: 'Strength score (0-4)', example: 3.5 },
                feedback: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Feedback messages',
                    example: ['Password strength: Good']
                },
                requirements: {
                    type: 'object',
                    properties: {
                        minLength: { type: 'boolean', example: true },
                        hasUppercase: { type: 'boolean', example: true },
                        hasLowercase: { type: 'boolean', example: true },
                        hasNumbers: { type: 'boolean', example: true },
                        hasSpecialChars: { type: 'boolean', example: true },
                        maxLength: { type: 'boolean', example: true }
                    }
                },
                suggestions: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Improvement suggestions',
                    example: ['Great job! Your password meets security requirements.']
                },
                strengthLabel: {
                    type: 'object',
                    properties: {
                        label: { type: 'string', example: 'Good' },
                        color: { type: 'string', example: '#88cc00' }
                    }
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    async validatePassword(@Body() body: { password: string }): Promise<PasswordStrengthResult & { strengthLabel: { label: string; color: string } }> {
        const analysis = PasswordStrengthUtil.analyzeStrength(body.password, {
            minLength: 8,
            maxLength: 64,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        });

        const strengthLabel = PasswordStrengthUtil.getStrengthLabel(analysis.score);

        return {
            ...analysis,
            strengthLabel
        };
    }

    @Post('generate-password')
    @ApiOperation({
        summary: 'Generate secure password',
        description: 'Generate a cryptographically secure password with customizable length'
    })
    @ApiResponse({
        status: 200,
        description: 'Generated secure password',
        schema: {
            type: 'object',
            properties: {
                password: { type: 'string', description: 'Generated secure password' },
                strength: {
                    type: 'object',
                    properties: {
                        score: { type: 'number' },
                        label: { type: 'string' },
                        color: { type: 'string' }
                    }
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    async generatePassword(@Query('length') length?: string): Promise<{
        password: string;
        strength: { score: number; label: string; color: string };
    }> {
        const passwordLength = length ? Math.max(8, Math.min(64, parseInt(length, 10))) : 12;
        const password = PasswordStrengthUtil.generateSecurePassword(passwordLength);
        const analysis = PasswordStrengthUtil.analyzeStrength(password);
        const strengthLabel = PasswordStrengthUtil.getStrengthLabel(analysis.score);

        return {
            password,
            strength: {
                score: analysis.score,
                label: strengthLabel.label,
                color: strengthLabel.color
            }
        };
    }

    @UseGuards(JwtRefreshStrategy)
    @Post('refresh')
    @ApiOperation({
        summary: 'Refresh access token',
        description: 'Generate a new access token using a valid refresh token'
    })
    @ApiResponse({
        status: 200,
        description: 'Token refresh successful',
        type: ReturnAuthDTO
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid refresh token'
    })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Public()
    // This endpoint is public because clients will be sending a refresh token (not an access token) when requesting a new access token JWT.
    async jwtRefreshToken(@Request() req): Promise<ReturnAuthDTO> {
        return await this.authService.jwtRefreshToken(req.user);
    }
}
