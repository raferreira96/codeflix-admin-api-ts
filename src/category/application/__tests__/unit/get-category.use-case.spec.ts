import {CategoryInMemoryRepository} from "../../../infra/db/in-memory/category-in-memory.repository";
import {InvalidUuidError, Uuid} from "../../../../shared/domain/value-objects/uuid.vo";
import {NotFoundError} from "../../../../shared/domain/errors/not-found.error";
import {Category} from "../../../domain/category.entity";
import {GetCategoryUseCase} from "../../get-category.use-case";

describe('GetCategoryUseCase Unit Tests', () => {
    let useCase: GetCategoryUseCase;
    let categoryRepository: CategoryInMemoryRepository;

    beforeEach(() => {
        categoryRepository = new CategoryInMemoryRepository();
        useCase = new GetCategoryUseCase(categoryRepository);
    });

    test('should throw error when category not found', async () => {
        const spyFindById = jest.spyOn(categoryRepository, 'findById');
        await expect(() => useCase.execute({ id: 'invalid_id' }))
            .rejects
            .toThrow(new InvalidUuidError());
        expect(spyFindById).not.toHaveBeenCalled();

        const uuid = new Uuid();

        await expect(() => useCase.execute({ id: uuid.id }))
            .rejects
            .toThrow(new NotFoundError(uuid.id, Category));
        expect(spyFindById).toHaveBeenCalledTimes(1);
    });

    test('should get a category', async () => {
        const category = Category.fake().aCategory().build();
        categoryRepository.items = [category];
        const spyFindById = jest.spyOn(categoryRepository, 'findById');
        const output = await useCase.execute({ id: category.category_id.id });
        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        });
    });
});