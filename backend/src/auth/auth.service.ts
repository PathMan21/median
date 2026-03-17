import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTokenRequest } from './dto/create-token.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createToken(createTokenRequest: CreateTokenRequest) {
    const user = await this.prisma.user.findUnique({
      where: { login: createTokenRequest.login },
    });

    let mdp;
    if (user) {
      mdp = await bcrypt.compare(createTokenRequest.password, user.password);
    }

    if (!user || !mdp) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    if (user.status === 'pending') {
      throw new UnauthorizedException('Veuillez vérifier votre adresse email avant de vous connecter. Consultez votre boite mail.');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Compte désactivé. Contactez l\'administrateur.');
    }

    const accessToken = Buffer.from(
      JSON.stringify({ sub: user.id, login: user.login })
    ).toString('base64');
    const refreshToken = Buffer.from(
      JSON.stringify({ sub: user.id, type: 'refresh' })
    ).toString('base64');

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

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = JSON.parse(Buffer.from(refreshToken, 'base64').toString());
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) throw new Error('User not found');

      const accessToken = Buffer.from(
        JSON.stringify({ sub: user.id, login: user.login })
      ).toString('base64');

      const now = new Date();
      const accessTokenExpiry = new Date(now.getTime() + 60 * 60 * 1000);
      const newRefreshToken = Buffer.from(
        JSON.stringify({ sub: user.id, type: 'refresh' })
      ).toString('base64');
      const refreshTokenExpiry = new Date(now.getTime() + 120 * 60 * 1000);

      return {
        accessToken,
        accessTokenExpiresAt: accessTokenExpiry.toISOString(),
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt: refreshTokenExpiry.toISOString(),
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async validateToken(accessToken: string) {
    try {
      const decoded = JSON.parse(Buffer.from(accessToken, 'base64').toString());
      if (decoded.type === 'refresh') throw new Error('Invalid token type');

      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) throw new Error('User not found');

      const now = new Date();
      const accessTokenExpiresAt = new Date(now.getTime() + 60 * 60 * 1000);

      return { accessToken, accessTokenExpiresAt: accessTokenExpiresAt.toISOString() };
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }
}
