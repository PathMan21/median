import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cinemas')
@ApiTags('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  // Routes publiques - consultation
  @Get()
  findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(+id);
  }

  // Routes protégées - administration
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
    return this.cinemasService.update(+id, updateCinemaDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(+id);
  }
}
