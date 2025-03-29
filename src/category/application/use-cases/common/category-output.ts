import {Category} from "../../../domain/category.entity";

export type CategoryOutput = {
    id: string;
    name: string;
    description: null | string;
    is_active: boolean;
    created_at: Date;
};

export class CategoryOutputMapper {
    static toOutput(category: Category): CategoryOutput {
        const { category_id, ...otherProps } = category.toJSON();
        return {
            id: category.category_id.id,
            ...otherProps,
        };
    }
}