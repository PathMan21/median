"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const articles_service_1 = require("./articles.service");
describe('ArticlesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [articles_service_1.ArticlesService],
        }).compile();
        service = module.get(articles_service_1.ArticlesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=articles.service.spec.js.map