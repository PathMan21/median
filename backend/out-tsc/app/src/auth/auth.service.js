"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createToken(createTokenRequest) {
        const user = await this.prisma.user.findUnique({
            where: { login: createTokenRequest.login },
        });
        if (!user || user.password !== createTokenRequest.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = Buffer.from(JSON.stringify({ sub: user.id, login: user.login })).toString('base64');
        const refreshToken = Buffer.from(JSON.stringify({ sub: user.id, type: 'refresh' })).toString('base64');
        const now = new Date();
        const accessTokenExpiry = new Date(now.getTime() + 60 * 60 * 1000);
        const refreshTokenExpiry = new Date(now.getTime() + 120 * 60 * 1000);
        return {
            accessToken,
            accessTokenExpiresAt: accessTokenExpiry.toISOString(),
            refreshToken,
            refreshTokenExpiresAt: refreshTokenExpiry.toISOString(),
            user: {
                id: user.id,
                login: user.login,
            },
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = JSON.parse(Buffer.from(refreshToken, 'base64').toString());
            if (decoded.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const accessToken = Buffer.from(JSON.stringify({ sub: user.id, login: user.login })).toString('base64');
            const now = new Date();
            const accessTokenExpiry = new Date(now.getTime() + 60 * 60 * 1000);
            const newRefreshToken = Buffer.from(JSON.stringify({ sub: user.id, type: 'refresh' })).toString('base64');
            const refreshTokenExpiry = new Date(now.getTime() + 120 * 60 * 1000);
            return {
                accessToken,
                accessTokenExpiresAt: accessTokenExpiry.toISOString(),
                refreshToken: newRefreshToken,
                refreshTokenExpiresAt: refreshTokenExpiry.toISOString(),
            };
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
    async validateToken(accessToken) {
        try {
            const decoded = JSON.parse(Buffer.from(accessToken, 'base64').toString());
            if (decoded.type === 'refresh') {
                throw new Error('Invalid token type');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const now = new Date();
            const accessTokenExpiresAt = new Date(now.getTime() + 60 * 60 * 1000);
            return {
                accessToken,
                accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
            };
        }
        catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map