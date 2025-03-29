import {IUseCase} from "../../../../shared/application/use-case.interface";
import {Uuid} from "../../../../shared/domain/value-objects/uuid.vo";
import {ICategoryRepository} from "../../../domain/category.repository";
import {NotFoundError} from "../../../../shared/domain/errors/not-found.error";
import {Category} from "../../../domain/category.entity";
import {CategoryOutput, CategoryOutputMapper} from "../common/category-output";

type GetCategoryInput = {
    id: string;
};

type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
        const uuid = new Uuid(input.id);

        const category = await this.categoryRepository.findById(uuid);

        if (! category) {
            throw new NotFoundError(uuid.id, Category);
        }

        return CategoryOutputMapper.toOutput(category);
    }
}