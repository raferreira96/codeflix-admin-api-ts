import {CategoryInMemoryRepository} from "../../../../infra/db/in-memory/category-in-memory.repository";
import {UpdateCategoryUseCase} from "../update-category.use-case";
import {InvalidUuidError, Uuid} from "../../../../../shared/domain/value-objects/uuid.vo";
import {NotFoundError} from "../../../../../shared/domain/errors/not-found.error";
import {Category} from "../../../../domain/category.entity";
import {EntityValidationError} from "../../../../../shared/domain/validators/validation.error";

describe('UpdateCategoryUseCase Unit Tests', () => {
    let useCase: UpdateCategoryUseCase;
    let categoryRepository: CategoryInMemoryRepository;

    beforeEach(() => {
        categoryRepository = new CategoryInMemoryRepository();
        useCase = new UpdateCategoryUseCase(categoryRepository);
    })

    test('should throw error when name is invalid', async () => {
        const category = Category.fake().aCategory().withName('Movie').build();
        categoryRepository.items = [category];
        const input = { id: category.category_id.id, name: 't'.repeat(256) };
        await expect(useCase.execute(input)).rejects.toThrow(EntityValidationError);
    });

    test('should throw error when category not found', async () => {
        await expect(() => useCase.execute({ id: 'invalid_id', name: 'Movie' }))
            .rejects
            .toThrow(new InvalidUuidError());

        const uuid = new Uuid();

        await expect(() => useCase.execute({ id: uuid.id, name: 'Movie' }))
            .rejects
            .toThrow(new NotFoundError(uuid.id, Category));
    });

    test('should update a category', async () => {
        const spyUpdate = jest.spyOn(categoryRepository, 'update');
        const spyFindById = jest.spyOn(categoryRepository, 'findById');

        const category = new Category({ name: 'Movie' });
        categoryRepository.items = [category];

        let output = await useCase.execute({ id: category.category_id.id, name: 'Movie Update' });
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: category.category_id.id,
            name: 'Movie Update',
            description: null,
            is_active: true,
            created_at: category.created_at,
        });

        type Arrange = {
            input: {
                id: string;
                name: string;
                description?: string | null;
                is_active?: boolean;
            },
            expected: {
                id: string;
                name: string;
                description: string | null;
                is_active: boolean;
                created_at: Date;
            },
        };

        const arrange: Arrange[] = [
            {
                input: {
                    id: category.category_id.id,
                    name: 'test',
                    description: 'some description',
                },
                expected: {
                    id: category.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: true,
                    created_at: category.created_at,
                },
            },
            {
                input: {
                    id: category.category_id.id,
                    name: 'test',
                    is_active: false,
                },
                expected: {
                    id: category.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                    created_at: category.created_at,
                },
            },
            {
                input: {
                    id: category.category_id.id,
                    name: 'test',
                },
                expected: {
                    id: category.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                    created_at: category.created_at,
                },
            },
            {
                input: {
                    id: category.category_id.id,
                    name: 'test',
                    is_active: true,
                },
                expected: {
                    id: category.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: true,
                    created_at: category.created_at,
                },
            },
        ];

        for (const i of arrange) {
            output = await useCase.execute({
                id: i.input.id,
                ...("name" in i.input && { name: i.input.name }),
                ...("description" in i.input && { description: i.input.description }),
                ...("is_active" in i.input && { is_active: i.input.is_active }),
            });

            expect(output).toStrictEqual({
                id: category.category_id.id,
                name: i.expected.name,
                description: i.expected.description,
                is_active: i.expected.is_active,
                created_at: i.expected.created_at,
            });
        }
    });
});