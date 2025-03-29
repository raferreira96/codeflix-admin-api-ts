import {IUseCase} from "../../../../shared/application/use-case.interface";
import {ICategoryRepository} from "../../../domain/category.repository";
import {Uuid} from "../../../../shared/domain/value-objects/uuid.vo";

export type DeleteCategoryInput = {
    id: string;
}

export type DeleteCategoryOutput = void;

export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
        const uuid = new Uuid(input.id);
        await this.categoryRepository.delete(uuid);
    }
}