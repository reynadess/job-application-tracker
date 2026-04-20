import { Expose } from 'node_modules/class-transformer/types';
import { IsJWT, IsNumber, IsString } from 'node_modules/class-validator/types';

export class AuthDTO {
    username: string;
    password: string;
}

export class ReturnAuthDTO {
    @IsNumber()
    userId: number;

    @IsString()
    username: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string;

    @IsJWT()
    access_token: string;

    @IsJWT()
    refresh_token: string;
}
