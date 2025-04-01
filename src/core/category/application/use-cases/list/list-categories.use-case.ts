import {IUseCase} from "@core/shared/application/use-case.interface";
import {CategorySearchParams, CategorySearchResult, ICategoryRepository} from "../../../domain/category.repository";
import {PaginationOutput, PaginationOutputMapper} from "@core/shared/application/pagination-output";
import {CategoryOutput, CategoryOutputMapper} from "../common/category-output";

export type ListCategoriesInput = CategorySearchParams;

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase implements IUseCase<ListCategoriesInput, ListCategoriesOutput> {
    constructor(private categoryRepository: ICategoryRepository) {}

    async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
        const params = new CategorySearchParams(input);

        const searchResult = await this.categoryRepository.search(params);

        return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
        const { items: _items } = searchResult;
        const items = _items.map((item) => CategoryOutputMapper.toOutput(item));
        return PaginationOutputMapper.toOutput(items, searchResult);
    }
}