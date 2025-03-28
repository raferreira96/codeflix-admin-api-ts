import {IUseCase} from "../../shared/application/use-case.interface";
import {ICategoryRepository} from "../domain/category.repository";
import {Uuid} from "../../shared/domain/value-objects/uuid.vo";
import {NotFoundError} from "../../shared/domain/errors/not-found.error";
import {Category} from "../domain/category.entity";

export type UpdateCategoryInput = {
    id: string;
    name?: string;
    description?: string;
    is_active?: boolean;
};

export type UpdateCategoryOutput = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
};

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
        const uuid = new Uuid(input.id);
        const category = await this.categoryRepository.findById(uuid);

        if (!category) {
            throw new NotFoundError(input.id, Category);
        }

        input.name && category.changeName(input.name);
        if ('description' in input) {
            category.changeDescription(input.description);
        }

        input.is_active ? category.activate() : category.deactivate();

        await this.categoryRepository.update(category);

        return {
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        };
    }
}