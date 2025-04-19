import {IUseCase} from "../../../../shared/application/use-case.interface";
import {ICategoryRepository} from "../../../domain/category.repository";
import {NotFoundError} from "../../../../shared/domain/errors/not-found.error";
import {Category, CategoryId} from "../../../domain/category.aggregate";
import {CategoryOutput, CategoryOutputMapper} from "../common/category-output";

type GetCategoryInput = {
    id: string;
};

export type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
        const categoryId = new CategoryId(input.id);

        const category = await this.categoryRepository.findById(categoryId);

        if (! category) {
            throw new NotFoundError(categoryId.id, Category);
        }

        return CategoryOutputMapper.toOutput(category);
    }
}