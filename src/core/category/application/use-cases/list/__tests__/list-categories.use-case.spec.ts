import {ListCategoriesInput, ListCategoriesUseCase} from "../list-categories.use-case";
import {CategoryInMemoryRepository} from "../../../../infra/db/in-memory/category-in-memory.repository";
import {CategorySearchResult} from "../../../../domain/category.repository";
import {Category} from "../../../../domain/category.aggregate";
import {CategoryOutputMapper} from "../../common/category-output";

describe('ListCategoriesUseCase Unit Tests', () => {
    let useCase: ListCategoriesUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new ListCategoriesUseCase(repository);
    });

    test('output method', () => {
        let result = new CategorySearchResult({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
        });
        let output = useCase['toOutput'](result);
        expect(output).toStrictEqual({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1,
        });

        const entity = Category.fake().aCategory().build();
        result = new CategorySearchResult({
            items: [entity],
            total: 1,
            current_page: 1,
            per_page: 2,
        });

        output = useCase['toOutput'](result);
        expect(output).toStrictEqual({
            items: [entity].map(CategoryOutputMapper.toOutput),
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1,
        });
    });

    test('should return output sorted by created_at when input param is empty', async () => {
        const items = [
            Category.fake().aCategory().withName('test 1').build(),
            Category.fake().aCategory().withName('test 2').withCreatedAt(new Date(new Date().getTime() + 100)).build(),
        ];
        repository.items = items;

        const output = await useCase.execute({} as ListCategoriesInput);
        expect(output).toStrictEqual({
            items: [...items].reverse().map(CategoryOutputMapper.toOutput),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1,
        });
    });

    it('should return output using pagination, sort and filter', async () => {
        const items = [
            Category.fake().aCategory().withName('aTest').build(),
            Category.fake().aCategory().withName('AAATest').build(),
            Category.fake().aCategory().withName('AaATest').build(),
            Category.fake().aCategory().withName('bTest').build(),
            Category.fake().aCategory().withName('cTest').build(),
        ];
        repository.items = items;

        let output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
        } as ListCategoriesInput);
        expect(output).toStrictEqual({
            items: [items[1], items[2]].map(CategoryOutputMapper.toOutput),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'a',
        } as ListCategoriesInput);
        expect(output).toStrictEqual({
            items: [items[0]].map(CategoryOutputMapper.toOutput),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'a',
        } as ListCategoriesInput);
        expect(output).toStrictEqual({
            items: [items[0], items[2]].map(CategoryOutputMapper.toOutput),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });
    });
});