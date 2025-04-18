import {CreateCategoryUseCase} from "../create-category.use-case";
import {CategorySequelizeRepository} from "../../../../infra/db/sequelize/category-sequelize.repository";
import {setupSequelize} from "../../../../../shared/infra/testing/helpers";
import {CategoryModel} from "../../../../infra/db/sequelize/category.model";
import {EntityValidationError} from "../../../../../shared/domain/validators/validation.error";
import {CategoryId} from "@core/category/domain/category.aggregate";

describe('CreateCategoryUseCase Integration Tests', () => {
    let useCase: CreateCategoryUseCase;
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new CreateCategoryUseCase(repository);
    });

    test('should throw error when category is invalid', async () => {
        const input = { name: 't'.repeat(256) };
        await expect(() => useCase.execute(input)).rejects.toThrow(EntityValidationError);
    });

    test('should create and insert a category', async () => {
        let output = await useCase.execute({ name: 'Movie' });
        let entity = await repository.findById(new CategoryId(output.id));
        expect(output).toStrictEqual({
            id: entity!.category_id.id,
            name: 'Movie',
            description: null,
            is_active: true,
            created_at: entity!.created_at,
        });

        output = await useCase.execute({ name: 'Movie', description: 'some description', is_active: false });
        entity = await repository.findById(new CategoryId(output.id));
        expect(output).toStrictEqual({
            id: entity!.category_id.id,
            name: 'Movie',
            description: 'some description',
            is_active: false,
            created_at: entity!.created_at,
        });
    });
});