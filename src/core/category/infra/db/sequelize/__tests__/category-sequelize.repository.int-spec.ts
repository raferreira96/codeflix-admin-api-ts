import {CategorySequelizeRepository} from "../category-sequelize.repository";
import {CategoryModel} from "../category.model";
import {Category, CategoryId} from "../../../../domain/category.aggregate";
import {NotFoundError} from "../../../../../shared/domain/errors/not-found.error";
import {CategoryModelMapper} from "../category-model-mapper";
import {CategorySearchParams, CategorySearchResult} from "../../../../domain/category.repository";
import {setupSequelize} from "../../../../../shared/infra/testing/helpers";

describe('CategorySequelizeRepository Integration Tests', () => {
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
    });

    test('should insert a new category', async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);

        const entity = await repository.findById(category.category_id);
        expect(entity!.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should insert a bulk of categories', async () => {
        const categories = Category.fake().theCategories(5).build();
        await repository.bulkInsert(categories);

        const categoriesFounded = await repository.findAll();
        expect(categoriesFounded).toHaveLength(5);
        expect(JSON.stringify(categoriesFounded)).toBe(JSON.stringify(categories));
    });

    test('should find a category by id', async () => {
        let categoryFounded = await repository.findById(new CategoryId());
        expect(categoryFounded).toBeNull();

        const category = Category.fake().aCategory().build();
        await repository.insert(category);
        categoryFounded = await repository.findById(category.category_id);
        expect(categoryFounded!.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should find all categories', async () => {
        const categories = Category.fake().theCategories(5).build();
        await repository.bulkInsert(categories);

        const categoriesFounded = await repository.findAll();
        expect(categoriesFounded).toHaveLength(5);
        expect(JSON.stringify(categoriesFounded)).toBe(JSON.stringify(categories));
    });

    test('should throw an error on update when category not found', async () => {
        const category = Category.fake().aCategory().build();
        await expect(repository.update(category))
            .rejects.toThrow(new NotFoundError(category.category_id.id, Category));
    });

    test('should update a category', async () => {
        const category = Category.fake().aCategory().withName('Movie').build();
        await repository.insert(category);
        let categoryFounded = await repository.findById(category.category_id);
        expect(categoryFounded!.name).toBe('Movie');

        category.changeName('Movie Updated');
        await repository.update(category);

        categoryFounded = await repository.findById(category.category_id);
        expect(categoryFounded!.name).toBe('Movie Updated');
        expect(categoryFounded!.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should throw an error on delete when category not found', async () => {
        const category = Category.fake().aCategory().build();
        await expect(repository.delete(category.category_id))
            .rejects.toThrow(new NotFoundError(category.category_id.id, Category));
    });

    test('should delete a category', async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);

        await repository.delete(category.category_id);

        await expect(repository.findById(category.category_id)).resolves.toBeNull();
    });

    describe('search', () => {
        test('should only apply paginate when other params are null', async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName('Movie')
                .withDescription('Movie Description')
                .withCreatedAt(created_at)
                .build();
            await repository.bulkInsert(categories);
            const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');

            const searchOutput = await repository.search(new CategorySearchParams());
            expect(searchOutput).toBeInstanceOf(CategorySearchResult);
            expect(spyToEntity).toHaveBeenCalledTimes(15);
            expect(searchOutput.toJSON()).toMatchObject({
                total: 16,
                current_page: 1,
                last_page: 2,
                per_page: 15,
            });
            searchOutput.items.forEach((item) => {
                expect(item).toBeInstanceOf(Category);
                expect(item.category_id).toBeDefined();
            });
            const items = searchOutput.items.map((item) => item.toJSON());
            expect(items).toMatchObject(
                new Array(15).fill({
                    name: 'Movie',
                    description: 'Movie Description',
                    is_active: true,
                    created_at,
                }),
            );
        });

        test('should order by created_at DESC when search params are null', async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName((index) => `Movie ${index}`)
                .withDescription('Movie Description')
                .withCreatedAt((index) => new Date(created_at.getTime() + index))
                .build();
            await repository.bulkInsert(categories);
            const searchOutput = await repository.search(new CategorySearchParams());
            const items = searchOutput.items;
            [...items].reverse().forEach((item, index) => {
                expect(`Movie ${index + 1}`).toBe(`${categories[index + 1].name}`);
            });
        });

        test('should apply paginate and filter', async () => {
            const categories = [
                Category.fake().aCategory().withName('test').withCreatedAt(new Date(new Date().getTime() + 5000)).build(),
                Category.fake().aCategory().withName('abcd').withCreatedAt(new Date(new Date().getTime() + 4000)).build(),
                Category.fake().aCategory().withName('TEST').withCreatedAt(new Date(new Date().getTime() + 3000)).build(),
                Category.fake().aCategory().withName('tEsT').withCreatedAt(new Date(new Date().getTime() + 1000)).build(),
            ];

            await repository.bulkInsert(categories);

            let searchOutput = await repository.search(
                new CategorySearchParams({
                    page: 1,
                    per_page: 2,
                    filter: 'test',
                }),
            );

            expect(searchOutput.toJSON(true)).toMatchObject(
                new CategorySearchResult({
                    items: [categories[0], categories[2]],
                    current_page: 1,
                    per_page: 2,
                    total: 3,
                }).toJSON(true),
            );

            searchOutput = await repository.search(
                new CategorySearchParams({
                    page: 2,
                    per_page: 2,
                    filter: 'TEST',
                }),
            );
            expect(searchOutput.toJSON(true)).toMatchObject(
                new CategorySearchResult({
                    items: [categories[3]],
                    current_page: 2,
                    per_page: 2,
                    total: 3,
                }).toJSON(true),
            );
        });

        test('should apply paginate and sort', async () => {
            expect(repository.sortableFields).toStrictEqual(['name','created_at']);

            const categories = [
                Category.fake().aCategory().withName('bTest').build(),
                Category.fake().aCategory().withName('aTest').build(),
                Category.fake().aCategory().withName('dTest').build(),
                Category.fake().aCategory().withName('eTest').build(),
                Category.fake().aCategory().withName('cTest').build(),
            ];
            await repository.bulkInsert(categories);

            const arrange = [
                {
                    params: new CategorySearchParams({
                        page: 1,
                        per_page: 2,
                        sort: 'name',
                    }),
                    result: new CategorySearchResult({
                        items: [categories[1], categories[0]],
                        current_page: 1,
                        per_page: 2,
                        total: 5,
                    }),
                },
                {
                    params: new CategorySearchParams({
                        page: 2,
                        per_page: 2,
                        sort: 'name',
                    }),
                    result: new CategorySearchResult({
                        items: [categories[4], categories[2]],
                        current_page: 2,
                        per_page: 2,
                        total: 5,
                    }),
                },
                {
                    params: new CategorySearchParams({
                        page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                    }),
                    result: new CategorySearchResult({
                        items: [categories[3], categories[2]],
                        current_page: 1,
                        per_page: 2,
                        total: 5,
                    }),
                },
            ];

            for (const i of arrange) {
                const result = await repository.search(i.params);
                expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
            }
        });

        describe('should search using filter, sort and paginate', () => {
            const categories = [
                Category.fake().aCategory().withName('test').build(),
                Category.fake().aCategory().withName('aZest').build(),
                Category.fake().aCategory().withName('TEST').build(),
                Category.fake().aCategory().withName('eZest').build(),
                Category.fake().aCategory().withName('TeSt').build(),
            ];

            const arrange = [
                {
                    search_params: new CategorySearchParams({
                        page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: 'TEST'
                    }),
                    search_result: new CategorySearchResult({
                        items: [categories[2], categories[4]],
                        current_page: 1,
                        per_page: 2,
                        total: 3,
                    }),
                },
                {
                    search_params: new CategorySearchParams({
                        page: 2,
                        per_page: 2,
                        sort: 'name',
                        filter: 'TEST',
                    }),
                    search_result: new CategorySearchResult({
                        items: [categories[0]],
                        current_page: 2,
                        per_page: 2,
                        total: 3,
                    }),
                },
            ];

            beforeEach(async () => {
                await repository.bulkInsert(categories);
            });

            test.each(arrange)('when value is $search_params', async ({ search_params, search_result }) => {
                const result = await repository.search(search_params);
                expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
            });
        });
    });
});