import {CategorySequelizeRepository} from "../../../../infra/db/sequelize/category-sequelize.repository";
import {setupSequelize} from "../../../../../shared/infra/testing/helpers";
import {CategoryModel} from "../../../../infra/db/sequelize/category.model";
import {Uuid} from "../../../../../shared/domain/value-objects/uuid.vo";
import {NotFoundError} from "../../../../../shared/domain/errors/not-found.error";
import {Category} from "../../../../domain/category.entity";
import {GetCategoryUseCase} from "../get-category.use-case";

describe('GetCategoryUseCase Integration Tests', () => {
    let useCase: GetCategoryUseCase;
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new GetCategoryUseCase(repository);
    });

    test('should throw error when category not found', async () => {
        const uuid = new Uuid();
        await expect(() => useCase.execute({ id: uuid.id }))
            .rejects
            .toThrow(new NotFoundError(uuid.id, Category));
    });

    test('should get a category', async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);

        const output = await useCase.execute({ id: category.category_id.id });
        await expect(output).toStrictEqual({
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        });
    });
});