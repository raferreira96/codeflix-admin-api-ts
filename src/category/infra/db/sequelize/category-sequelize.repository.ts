import {CategorySearchParams, CategorySearchResult, ICategoryRepository} from "../../../domain/category.repository";
import {Category} from "../../../domain/category.entity";
import {Op, Promise} from "sequelize";
import {Uuid} from "../../../../shared/domain/value-objects/uuid.vo";
import {CategoryModel} from "./category.model";
import {NotFoundError} from "../../../../shared/domain/errors/not-found.error";

export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ['name', 'created_at'];

    constructor(private categoryModel: typeof CategoryModel) {};

    async insert(entity: Category): Promise<void> {
        await this.categoryModel.create({
            category_id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        });
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        await this.categoryModel.bulkCreate(entities.map((entity) => ({
            category_id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        })));
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        return models.map((model) => {
            return new Category({
                category_id: new Uuid(model.category_id),
                name: model.name,
                description: model.description,
                is_active: model.is_active,
                created_at: model.created_at,
            });
        });
    }

    async findById(entity_id: Uuid): Promise<Category | null> {
        const model = await this._get(entity_id.id);
        if (!model) return null;
        return new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
        });
    }

    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;

        const { rows: models, count } = await this.categoryModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: { [Op.like]: `%${props.filter}%` }
                },
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? { order: [[props.sort, props.sort_dir]] }
                : { order: [['created_at', 'desc']] }),
            offset,
            limit,
        });

        return new CategorySearchResult({
            items: models.map((model) => {
                return new Category({
                    category_id: new Uuid(model.category_id),
                    name: model.name,
                    description: model.description,
                    is_active: model.is_active,
                    created_at: model.created_at,
                });
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count as number,
        });
    }

    async update(entity: Category): Promise<void> {
        const categoryId = entity.category_id.id;
        const model = await this._get(categoryId);
        if (!model) {
            throw new NotFoundError(categoryId, this.getEntity());
        }

        await this.categoryModel.update(
            {
                category_id: entity.category_id.id,
                name: entity.name,
                description: entity.description,
                is_active: entity.is_active,
                created_at: entity.created_at,
            },
            {
                where: { category_id: categoryId },
                returning: true,
            },
        );
    }

    async delete(entity_id: Uuid): Promise<void> {
        const categoryId = entity_id.id;
        const model = await this._get(categoryId);
        if (!model) {
            throw new NotFoundError(categoryId, this.getEntity());
        }

        await this.categoryModel.destroy({ where: { category_id: categoryId } });
    }

    getEntity(): { new(...args: any[]): Category } {
        return Category;
    }

    private async _get(category_id: string) {
        return this.categoryModel.findByPk(category_id);
    }
}