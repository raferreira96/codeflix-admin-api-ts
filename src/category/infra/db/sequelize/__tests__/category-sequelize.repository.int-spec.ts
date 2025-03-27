import {CategorySequelizeRepository} from "../category-sequelize.repository";
import {Sequelize} from "sequelize-typescript";
import {CategoryModel} from "../category.model";
import {Category} from "../../../../domain/category.entity";
import {Uuid} from "../../../../../shared/domain/value-objects/uuid.vo";
import {NotFoundError} from "../../../../../shared/domain/errors/not-found.error";

describe('CategorySequelizeRepository Integration Tests', () => {
    let sequelize;
    let repository: CategorySequelizeRepository;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [CategoryModel],
            logging: false,
        });
        await sequelize.sync({ force: true });

        repository = new CategorySequelizeRepository(CategoryModel);
    });

    test('should insert a new category', async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);

        const entity = await repository.findById(category.category_id);
        expect(entity.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should insert a bulk of categories', async () => {
        const categories = Category.fake().theCategories(5).build();
        await repository.bulkInsert(categories);

        const categoriesFounded = await repository.findAll();
        expect(categoriesFounded).toHaveLength(5);
        expect(JSON.stringify(categoriesFounded)).toBe(JSON.stringify(categories));
    });

    test('should find a category by id', async () => {
        let categoryFounded = await repository.findById(new Uuid());
        expect(categoryFounded).toBeNull();

        const category = Category.fake().aCategory().build();
        await repository.insert(category);
        categoryFounded = await repository.findById(category.category_id);
        expect(categoryFounded.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should find all categories', async () => {
        const categories = Category.fake().theCategories(5).build();
        await repository.bulkInsert(categories);

        const categoriesFounded = await repository.findAll();
        expect(categoriesFounded).toHaveLength(5);
        expect(JSON.stringify(categoriesFounded)).toBe(JSON.stringify(categories));
    });

    test('should throw an error on update when category not found', async () => {
        const category = Category.fake().aCategory().build();
        await expect(repository.update(category))
            .rejects.toThrow(new NotFoundError(category.category_id.id, Category));
    });

    test('should update a category', async () => {
        const category = Category.fake().aCategory().withName('Movie').build();
        await repository.insert(category);
        let categoryFounded = await repository.findById(category.category_id);
        expect(categoryFounded.name).toBe('Movie');

        category.changeName('Movie Updated');
        await repository.update(category);

        categoryFounded = await repository.findById(category.category_id);
        expect(categoryFounded.name).toBe('Movie Updated');
        expect(categoryFounded.toJSON()).toStrictEqual(category.toJSON());
    });

    test('should throw an error on delete when category not found', async () => {
        const category = Category.fake().aCategory().build();
        await expect(repository.delete(category.category_id))
            .rejects.toThrow(new NotFoundError(category.category_id.id, Category));
    });

    test('should delete a category', async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);

        await repository.delete(category.category_id);

        await expect(repository.findById(category.category_id)).resolves.toBeNull();
    });
});