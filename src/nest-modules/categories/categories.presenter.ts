import {CategoryOutput} from "@core/category/application/use-cases/common/category-output";
import {Transform} from "class-transformer";
import {ListCategoriesOutput} from "@core/category/application/use-cases/list/list-categories.use-case";
import {CollectionPresenter} from "../shared-module/collection.presenter";

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

export class CategoryCollectionPresenter extends CollectionPresenter {
    data: CategoryPresenter[];

    constructor(output: ListCategoriesOutput) {
        const { items, ...paginationProps } = output;
        super(paginationProps);
        this.data = items.map((item) => new CategoryPresenter(item));
    }
}