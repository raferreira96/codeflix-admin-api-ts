import {Category} from "../category.entity";
import {Uuid} from "../../../shared/domain/value-objects/uuid.vo";

describe('Category Unit Tests', () => {
    let validateSpy: jest.SpyInstance;
    beforeEach(() => {
        validateSpy = jest.spyOn(Category, 'validate');
    });

    describe('constructor', () => {
        test('should create a category with mandatory values', () => {
            const category = new Category({
                name: 'Movie',
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
        });

        test('should create a category with all values', () => {
            const createdAt = new Date();
            const category = new Category({
                name: 'Movie',
                description: 'Movie category',
                is_active: false,
                created_at: createdAt,
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBe('Movie category');
            expect(category.is_active).toBeFalsy();
            expect(category.created_at).toBe(createdAt);
        });
    });

    describe('category id', () => {
        const arrange = [
            { category_id: null },
            { category_id: undefined },
            // { category_id: '' },
            // { category_id: 'invalid' },
            // { category_id: '48a719a4-9b4e-4716-9583-9d7c7a7e7d7f' },
            { category_id: new Uuid() },
        ];

        test.each(arrange)('id = %j', ({ category_id }) => {
            const category = new Category({
                category_id: category_id as any,
                name: 'Movie',
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            if (category_id instanceof Uuid) {
                expect(category.category_id).toBe(category_id);
            }
        });
    });

    describe('create', () => {
        test('should create a category with mandatory values', () => {
            const category = Category.create({
                name: 'Movie',
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test('should create a category with all values', () => {
            const category = Category.create({
                name: 'Movie',
                description: 'Movie category',
                is_active: false,
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe('Movie');
            expect(category.description).toBe('Movie category');
            expect(category.is_active).toBeFalsy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        test('should change category name', () => {
            const newName = 'Book';
            const category = Category.create({
                name: 'Movie',
            });
            category.changeName(newName);
            expect(category.name).toBe(newName);
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });

        test('should change category description', () => {
            const newDescription = 'Lorem ipsum';
            const category = Category.create({
                name: 'Movie',
            });
            category.changeDescription(newDescription);
            expect(category.name).toBe('Movie');
            expect(category.description).toBe(newDescription);
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });

        test('should active a category', () => {
            const category = Category.create({
                name: 'Movie',
                is_active: false,
            });
            expect(category.is_active).toBeFalsy();
            category.activate();
            expect(category.name).toBe('Movie');
            expect(category.is_active).toBeTruthy();
        });

        test('should disable a category', () => {
            const category = Category.create({
                name: 'Movie',
            });
            expect(category.is_active).toBeTruthy();
            category.deactivate();
            expect(category.name).toBe('Movie');
            expect(category.is_active).toBeFalsy();
        });
    });

    describe('validations', () => {
        describe('create', () => {
            describe('should contains error messages when name is invalid', () => {
                const arrange = [
                    { name: '', errorMessages: ['name should not be empty', 'name must be longer than or equal to 4 characters'] },
                    { name: null, errorMessages: ['name should not be empty', 'name must be a string', 'name must be shorter than or equal to 255 characters', 'name must be longer than or equal to 4 characters'] },
                    { name: undefined, errorMessages: ['name should not be empty', 'name must be a string', 'name must be shorter than or equal to 255 characters', 'name must be longer than or equal to 4 characters'] },
                    { name: 'foo', errorMessages: ['name must be longer than or equal to 4 characters'] },
                    { name: 123, errorMessages: ['name must be a string', 'name must be shorter than or equal to 255 characters', 'name must be longer than or equal to 4 characters'] },
                    { name: "t".repeat(256), errorMessages: ['name must be shorter than or equal to 255 characters'] },
                ];

                test.each(arrange)('name = %s', ({ name, errorMessages }) => {
                    expect(() => Category.create({
                        name: name as any,
                    })).containsErrorMessages({
                        name: errorMessages,
                    });
                });
            });
            describe('should contains error messages when description is invalid', () => {
                const arrange = [
                    { description: '', errorMessages: ['description must be longer than or equal to 8 characters'] },
                    { description: 'foo', errorMessages: ['description must be longer than or equal to 8 characters'] },
                    { description: 123, errorMessages: ['description must be a string', 'description must be shorter than or equal to 255 characters', 'description must be longer than or equal to 8 characters'] },
                    { description: "t".repeat(256), errorMessages: ['description must be shorter than or equal to 255 characters'] },
                ];

                test.each(arrange)('description = %s', ({ description, errorMessages }) => {
                    expect(() => Category.create({
                        name: 'Movie',
                        description: description as any,
                    })).containsErrorMessages({
                        description: errorMessages,
                    });
                });
            });
            describe('should contains error messages when is_active is invalid', () => {
                const arrange = [
                    { is_active: '', errorMessages: ['is_active must be a boolean value'] },
                    { is_active: 'foo', errorMessages: ['is_active must be a boolean value'] },
                    { is_active: 123, errorMessages: ['is_active must be a boolean value'] },
                ];

                test.each(arrange)('is_active = %s', ({ is_active, errorMessages }) => {
                    expect(() => Category.create({
                        name: 'Movie',
                        is_active: is_active as any,
                    })).containsErrorMessages({
                        is_active: errorMessages,
                    });
                });
            });
        });
        describe('update', () => {
            describe('should contains error messages when name is invalid', () => {
                const arrange = [
                    { name: '', errorMessages: ['name should not be empty', 'name must be longer than or equal to 4 characters'] },
                    { name: null, errorMessages: ['name should not be empty', 'name must be a string', 'name must be shorter than or equal to 255 characters', 'name must be longer than or equal to 4 characters'] },
                    { name: undefined, errorMessages: ['name should not be empty', 'name must be a string', 'name must be shorter than or equal to 255 characters', 'name must be longer than or equal to 4 characters'] },
                    { name: 'foo', errorMessages: ['name must be longer than or equal to 4 characters'] },
                    { name: 123, errorMessages: ['name must be a string', 'name must be shorter than or equal to 255 characters', 'name must be longer than or equal to 4 characters'] },
                    { name: "t".repeat(256), errorMessages: ['name must be shorter than or equal to 255 characters'] },
                ];

                test.each(arrange)('name = %s', ({ name, errorMessages }) => {
                    const category = Category.create({
                        name: 'Movie',
                    });
                    expect(() => category.changeName(name as any))
                        .containsErrorMessages({ name: errorMessages });
                });
            });
            describe('should contains error messages when description is invalid', () => {
                const arrange = [
                    { description: '', errorMessages: ['description must be longer than or equal to 8 characters'] },
                    { description: 'foo', errorMessages: ['description must be longer than or equal to 8 characters'] },
                    { description: 123, errorMessages: ['description must be a string', 'description must be shorter than or equal to 255 characters', 'description must be longer than or equal to 8 characters'] },
                    { description: "t".repeat(256), errorMessages: ['description must be shorter than or equal to 255 characters'] },
                ];

                test.each(arrange)('description = %s', ({ description, errorMessages }) => {
                    const category = Category.create({
                        name: 'Movie',
                    });
                    expect(() => category.changeDescription(description as any))
                        .containsErrorMessages({ description: errorMessages });
                });
            });
        });
    });
});