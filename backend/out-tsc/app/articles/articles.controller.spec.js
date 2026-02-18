"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const articles_controller_1 = require("./articles.controller");
const articles_service_1 = require("./articles.service");
describe('ArticlesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [articles_controller_1.ArticlesController],
            providers: [articles_service_1.ArticlesService],
        }).compile();
        controller = module.get(articles_controller_1.ArticlesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=articles.controller.spec.js.map