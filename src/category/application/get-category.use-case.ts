import {IUseCase} from "../../shared/application/use-case.interface";
import {Uuid} from "../../shared/domain/value-objects/uuid.vo";
import {ICategoryRepository} from "../domain/category.repository";
import {NotFoundError} from "../../shared/domain/errors/not-found.error";
import {Category} from "../domain/category.entity";

type GetCategoryInput = {
    id: string;
};

type GetCategoryOutput = {
    id: string;
    name: string;
    description: null | string;
    is_active: boolean;
    created_at: Date;
};

export class GetCategoryUseCase implements IUseCase<GetCategoryInput, GetCategoryOutput> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
        const uuid = new Uuid(input.id);

        const category = await this.categoryRepository.findById(uuid);

        if (! category) {
            throw new NotFoundError(uuid.id, Category);
        }

        return {
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        };
    }
}