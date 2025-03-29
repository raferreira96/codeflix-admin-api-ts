import {CategoryOutputMapper} from "./category-output";
import {Category} from "../../../domain/category.entity";

describe('CategoryOutputMapper Unit Tests', () => {
    test('should convert a category to output', () => {
        const category = Category.fake().aCategory().build();
        const spyToJSON = jest.spyOn(category, 'toJSON');

        const output = CategoryOutputMapper.toOutput(category);
        expect(spyToJSON).toHaveBeenCalledTimes(1);

        expect(output).toStrictEqual({
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: true,
            created_at: category.created_at,
        });
    });
});