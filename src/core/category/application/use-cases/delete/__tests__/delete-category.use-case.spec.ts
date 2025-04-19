import {CategoryInMemoryRepository} from "../../../../infra/db/in-memory/category-in-memory.repository";
import {DeleteCategoryUseCase} from "../delete-category.use-case";
import {InvalidUuidError} from "../../../../../shared/domain/value-objects/uuid.vo";
import {NotFoundError} from "../../../../../shared/domain/errors/not-found.error";
import {Category, CategoryId} from "../../../../domain/category.aggregate";

describe('DeleteCategoryUseCase Unit Tests', () => {
    let useCase: DeleteCategoryUseCase;
    let categoryRepository: CategoryInMemoryRepository;

    beforeEach(() => {
        categoryRepository = new CategoryInMemoryRepository();
        useCase = new DeleteCategoryUseCase(categoryRepository);
    });

    test('should throw error when category not found', async () => {
        await expect(() => useCase.execute({ id: 'invalid_id' }))
            .rejects
            .toThrow(new InvalidUuidError());

        const categoryId = new CategoryId();

        await expect(() => useCase.execute({ id: categoryId.id }))
            .rejects
            .toThrow(new NotFoundError(categoryId.id, Category));
    });

    test('should delete a category', async () => {
        const category = Category.fake().aCategory().build();
        categoryRepository.items = [category];
        const spyDelete = jest.spyOn(categoryRepository, 'delete');
        const output = await useCase.execute({ id: category.category_id.id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(output).toBeUndefined();
        expect(categoryRepository.items).toHaveLength(0);
    });
});