import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto): any;
    findAll(): any;
    findDrafts(): any;
    findOne(id: string): any;
    update(id: string, updateArticleDto: UpdateArticleDto): any;
    remove(id: string): any;
}
