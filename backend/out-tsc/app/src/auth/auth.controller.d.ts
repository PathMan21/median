import { AuthService } from './auth.service';
import { CreateTokenRequest } from './dto/create-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createToken(createTokenRequest: CreateTokenRequest): Promise<{
        accessToken: any;
        accessTokenExpiresAt: string;
        refreshToken: any;
        refreshTokenExpiresAt: string;
        user: {
            id: any;
            login: any;
        };
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: any;
        accessTokenExpiresAt: string;
        refreshToken: any;
        refreshTokenExpiresAt: string;
    }>;
    validateToken(accessToken: string): Promise<{
        accessToken: string;
        accessTokenExpiresAt: string;
    }>;
}
