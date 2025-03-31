import {CategoryOutput} from "@core/category/application/use-cases/common/category-output";
import {Transform} from "class-transformer";

export class CategoryPresenter {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    @Transform(({ value }: { value: Date }) => value.toISOString())
    created_at: Date;

    constructor(output: CategoryOutput) {
        this.id = output.id;
        this.name = output.name;
        this.description = output.description as any;
        this.is_active = output.is_active as any;
        this.created_at = output.created_at as any;
    }
}