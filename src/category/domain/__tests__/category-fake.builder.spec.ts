import {CategoryFakeBuilder} from "../category-fake.builder";
import {Uuid} from "../../../shared/domain/value-objects/uuid.vo";

describe('CategoryFakeBuilder Unit Tests', () => {
    describe('category_id prop', () => {
        const faker = CategoryFakeBuilder.aCategory();

        test('should throw an error when any methods has called', () => {
            expect(() => faker.category_id).toThrowError(new Error("Property category_id not have a factory, use 'with' methods."));
        });

        test('should be undefined', () => {
            expect(faker['_category_id']).toBeUndefined();
        });

        test('withUuid', () => {
            const category_id = new Uuid();
            const $this = faker.withUuid(category_id);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_category_id']).toBe(category_id);

            faker.withUuid(() => category_id);
            //@ts-expect-error _category_id is a callable
            expect(faker['_category_id']()).toBe(category_id);
            // expect(faker.category_id).toBe(category_id);
        });

        test('should pass index to category_id factory', () => {
            let mockFactory = jest.fn(() => new Uuid());
            faker.withUuid(mockFactory);
            faker.build();
            expect(mockFactory).toHaveBeenCalledTimes(1);

            const categoryId = new Uuid();
            mockFactory = jest.fn(() => categoryId);
            const fakerMany = CategoryFakeBuilder.theCategories(2);
            fakerMany.withUuid(mockFactory);
            fakerMany.build();

            expect(mockFactory).toHaveBeenCalledTimes(2);
            // expect(fakerMany.build()[0].category_id).toBe(categoryId);
            // expect(fakerMany.build()[1].category_id).toBe(categoryId);
        });
    });
});