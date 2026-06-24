import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountRequest } from './dto/create-account.dto';
import { EditAccountRequest } from './dto/edit-account.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // Routes publiques - inscription et vérification email
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createAccountRequest: CreateAccountRequest) {
    return this.accountService.create(createAccountRequest);
  }

  @Get('verify/:token')
  @ApiOkResponse({ description: 'Email vérifié avec succès' })
  verifyEmail(@Param('token') token: string) {
    return this.accountService.verifyEmail(token);
  }

  // Routes protégées - accès aux données du compte
  @Get(':uid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('uid') uid: string) {
    return this.accountService.findOne(uid);
  }

  @Put(':uid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  update(
    @Param('uid') uid: string,
    @Body() editAccountRequest: EditAccountRequest,
  ) {
    return this.accountService.update(uid, editAccountRequest);
  }
}
