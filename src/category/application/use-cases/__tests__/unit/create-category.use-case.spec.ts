import {CreateCategoryUseCase} from "../../create-category.use-case";
import {CategoryInMemoryRepository} from "../../../../infra/db/in-memory/category-in-memory.repository";
import {Category} from "../../../../domain/category.entity";
import {EntityValidationError} from "../../../../../shared/domain/validators/validation.error";

class CategoryRepository {
}

describe('CreateCategoryUseCase Unit Tests', () => {
    let useCase: CreateCategoryUseCase;
    let categoryRepository: CategoryInMemoryRepository;

    beforeEach(() => {
        categoryRepository = new CategoryInMemoryRepository();
        useCase = new CreateCategoryUseCase(categoryRepository);
    });

    test('should throw error when name is invalid', async () => {
        const input = { name: 't'.repeat(256) };
        await expect(useCase.execute(input)).rejects.toThrow(EntityValidationError);
    });

    test('should create and insert a category', async () => {
        const spyInsert = jest.spyOn(categoryRepository, 'insert');
        let output = await useCase.execute({ name: 'Movie' });
        expect(spyInsert).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: categoryRepository.items[0].category_id.id,
            name: 'Movie',
            description: null,
            is_active: true,
            created_at: categoryRepository.items[0].created_at,
        });

        output = await useCase.execute({ name: 'Movie', description: 'description', is_active: false });
        expect(spyInsert).toHaveBeenCalledTimes(2);
        expect(output).toStrictEqual({
            id: categoryRepository.items[1].category_id.id,
            name: 'Movie',
            description: 'description',
            is_active: false,
            created_at: categoryRepository.items[1].created_at,
        });
    });
});