import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createAccountRequest: CreateAccountRequest) {
    if (!createAccountRequest.login || !createAccountRequest.password) {
      throw new BadRequestException('Login et mot de passe requis.');
    }
    if (!createAccountRequest.email) {
      throw new BadRequestException('Email requis.');
    }

    try {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(createAccountRequest.password, saltRounds);

      const verificationToken = crypto.randomBytes(32).toString('hex');

      const user = await this.prisma.user.create({
        data: {
          login: createAccountRequest.login,
          email: createAccountRequest.email,
          password: hashed,
          roles: createAccountRequest.roles || ['ROLE_USER'],
          status: 'pending',             
          verificationToken,
        },
        select: {
          id: true,
          login: true,
          email: true,
          roles: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await this.mailService.sendWelcomeMail(user.email, user.login, verificationToken);

      return user;
    } catch (e: any) {
      if (e.code === 'P2002') {
        const field = e.meta?.target?.includes('email') ? 'email' : 'login';
        throw new ConflictException(`Ce ${field} est déjà utilisé.`);
      }
      throw e;
    }()
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token de vérification invalide ou expiré.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'active',
        verificationToken: null,  
      },
    });

    return { message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' };
  }

  findOne(uid: string) {
    const id = parseInt(uid, 10);
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, login: true, email: true, roles: true, status: true, createdAt: true, updatedAt: true },
    });
  }

  update(uid: string, editAccountRequest: EditAccountRequest) {
    const id = parseInt(uid, 10);
    return this.prisma.user.update({
      where: { id },
      data: editAccountRequest,
      select: { id: true, login: true, email: true, roles: true, status: true, createdAt: true, updatedAt: true },
    });
  }
}
