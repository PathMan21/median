import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createArticleDto: CreateArticleDto): any;
    findAll(): any;
    findDrafts(): any;
    findOne(id: number): any;
    update(id: number, updateArticleDto: UpdateArticleDto): any;
    remove(id: number): any;
}
