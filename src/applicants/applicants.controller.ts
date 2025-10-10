import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { Public } from '../auth/public.decorator';
import { ReturnApplicantDto, UpdateApplicantDto } from './applicant.dto';
import { Applicant } from './applicant.entity';
import { ApplicantHook } from './applicant.hook';
import { ApplicantsService } from './applicants.service';
@Controller('applicants')
@ApiTags('applicants')
@ApiBearerAuth()
export class ApplicantsController {
    constructor(private readonly applicantsService: ApplicantsService) {}

    @Get('check-availability')
    @Public()
    @ApiOperation({ 
        summary: 'Check username and email availability',
        description: 'Check if a username and/or email is available for registration. Provides suggestions if username is taken.'
    })
    @ApiQuery({ 
        name: 'username', 
        required: false, 
        description: 'Username to check availability for',
        example: 'johndoe123'
    })
    @ApiQuery({ 
        name: 'email', 
        required: false, 
        description: 'Email to check availability for',
        example: 'john.doe@example.com'
    })
    @ApiResponse({
        status: 200,
        description: 'Availability check results',
        schema: {
            type: 'object',
            properties: {
                usernameAvailable: { type: 'boolean', description: 'Whether the username is available' },
                emailAvailable: { type: 'boolean', description: 'Whether the email is available' },
                suggestions: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Suggested usernames if the original is taken'
                }
            }
        }
    })
    async checkAvailability(
        @Query('username') username?: string,
        @Query('email') email?: string,
    ): Promise<{
        usernameAvailable?: boolean;
        emailAvailable?: boolean;
        suggestions?: string[];
    }> {
        return await this.applicantsService.checkAvailability(username, email);
    }

    @Get('username/:username/available')
    @Public()
    @ApiOperation({ 
        summary: 'Check if specific username is available',
        description: 'Quick check to see if a specific username is available for registration'
    })
    @ApiResponse({
        status: 200,
        description: 'Username availability status',
        schema: {
            type: 'object',
            properties: {
                available: { type: 'boolean', description: 'Whether the username is available' },
                username: { type: 'string', description: 'The username that was checked' }
            }
        }
    })
    async checkUsernameAvailability(
        @Param('username') username: string,
    ): Promise<{ available: boolean; username: string }> {
        const available = await this.applicantsService.isUsernameAvailable(username);
        return { available, username };
    }

    @Get(':username')
    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Applicant, ApplicantHook)
    @ApiOperation({ 
        summary: 'Get applicant by username',
        description: 'Retrieve applicant details by username (requires authentication)'
    })
    async getApplicantByUsername(
        @Param('username') username: string,
    ): Promise<ReturnApplicantDto | undefined> {
        return await this.applicantsService.getApplicant(username);
    }

    @Patch(':username')
    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Applicant, ApplicantHook)
    @ApiOperation({ 
        summary: 'Update applicant',
        description: 'Update applicant details (requires authentication and proper permissions)'
    })
    async updateApplicant(
        @Param('username') username: string,
        @Body() updateData: UpdateApplicantDto,
    ): Promise<ReturnApplicantDto> {
        const updatedApplicant: ReturnApplicantDto =
            await this.applicantsService.updateOne(username, updateData);
        return updatedApplicant;
    }
}
