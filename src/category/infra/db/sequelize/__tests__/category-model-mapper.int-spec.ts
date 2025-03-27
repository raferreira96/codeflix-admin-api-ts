import {CategorySequelizeRepository} from "../category-sequelize.repository";
import {Sequelize} from "sequelize-typescript";
import {CategoryModel} from "../category.model";
import {Uuid} from "../../../../../shared/domain/value-objects/uuid.vo";
import {CategoryModelMapper} from "../category-model-mapper";
import {EntityValidationError} from "../../../../../shared/domain/validators/validation.error";
import {Category} from "../../../../domain/category.entity";

describe('CategoryModelMapper Integration Tests', () => {
    let sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [CategoryModel],
            logging: false,
        });
        await sequelize.sync({ force: true });
    });

    test('should throws error when category is invalid', () => {
        const model = CategoryModel.build({
            category_id: '9366b0a2-4f3c-4d7e-8b1f-5a6c9e0d5f3b',
        });

        try {
            CategoryModelMapper.toEntity(model);
            fail("Category is valid, but it needs throws EntityValidationError");
        } catch (error) {
            expect(error).toBeInstanceOf(EntityValidationError);
        }
    });

    test('should convert a category model to a category entity', () => {
        const created_at = new Date();

        const categoryData = {
            category_id: '9366b0a2-4f3c-4d7e-8b1f-5a6c9e0d5f3b',
            name: 'Category 1',
            description: 'Description 1',
            is_active: true,
            created_at,
        }

        const model = CategoryModel.build(categoryData);

        const entity = CategoryModelMapper.toEntity(model);
        expect(entity.toJSON()).toStrictEqual(
            new Category({ ...categoryData, category_id: new Uuid(categoryData.category_id) }).toJSON(),
        );
    });

    test('should convert a category entity to a category model', () => {
        const created_at = new Date();

        const categoryData = {
            category_id: new Uuid('9366b0a2-4f3c-4d7e-8b1f-5a6c9e0d5f3b'),
            name: 'Category 1',
            description: 'Description 1',
            is_active: true,
            created_at,
        }

        const entity = new Category(categoryData);

        const model = CategoryModelMapper.toModel(entity);
        expect(model.toJSON()).toStrictEqual({
            ...categoryData,
            category_id: categoryData.category_id.id,
        });
    });
});