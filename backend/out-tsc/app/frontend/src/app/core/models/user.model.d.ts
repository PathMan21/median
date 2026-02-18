export interface User {
    id: number;
    login: string;
    roles: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TokenResponse {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}
export interface LoginRequest {
    login: string;
    password: string;
}
export interface CreateAccountRequest {
    login: string;
    password: string;
    roles?: string[];
}
