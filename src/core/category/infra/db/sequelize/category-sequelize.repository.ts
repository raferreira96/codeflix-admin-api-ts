import {CategorySearchParams, CategorySearchResult, ICategoryRepository} from "../../../domain/category.repository";
import {Category, CategoryId} from "../../../domain/category.aggregate";
import {literal, Op} from "sequelize";
import {CategoryModel} from "./category.model";
import {NotFoundError} from "@core/shared/domain/errors/not-found.error";
import {CategoryModelMapper} from "./category-model-mapper";
import {SortDirection} from "@core/shared/domain/repository/search-params";

export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ['name', 'created_at'];

    orderBy = {
        mysql: {
            name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
        },
    };

    constructor(private categoryModel: typeof CategoryModel) {};

    async insert(entity: Category): Promise<void> {
        const model = CategoryModelMapper.toModel(entity);
        await this.categoryModel.create(model.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        const models = entities.map((entity) => CategoryModelMapper.toModel(entity).toJSON());
        await this.categoryModel.bulkCreate(models);
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        return models.map((model) => CategoryModelMapper.toEntity(model));
    }

    async findById(entity_id: CategoryId): Promise<Category | null> {
        const model = await this._get(entity_id.id);

        return model ? CategoryModelMapper.toEntity(model) : null;
    }

    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;

        const { rows: models, count } = await this.categoryModel.findAndCountAll({
            where: {
                ...(props.filter && {
                    name: { [Op.like]: `%${props.filter}%` }
                }),
            },
            order: props.sort && this.sortableFields.includes(props.sort)
                ? this.formatSort(props.sort, props.sort_dir)
                : [['created_at', 'desc']],
            offset,
            limit,
        });

        return new CategorySearchResult({
            items: models.map((model) => CategoryModelMapper.toEntity(model)),
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

        const modelToUpdate = CategoryModelMapper.toModel(entity);
        await this.categoryModel.update(
            modelToUpdate.toJSON(),
            {
                where: { category_id: categoryId },
                returning: true,
            },
        );
    }

    async delete(entity_id: CategoryId): Promise<void> {
        const categoryId = entity_id.id;
        const model = await this._get(categoryId);
        if (!model) {
            throw new NotFoundError(categoryId, this.getEntity());
        }

        await this.categoryModel.destroy({ where: { category_id: categoryId } });
    }

    private formatSort(sort: string, sort_dir: SortDirection|null) {
        const dialect = this.categoryModel.sequelize?.getDialect() as 'mysql';
        if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
            return this.orderBy[dialect][sort](sort_dir);
        }
        return [[sort, sort_dir]];
    }

    getEntity(): { new(...args: any[]): Category } {
        return Category;
    }

    private async _get(category_id: string) {
        return this.categoryModel.findByPk(category_id);
    }

    existsById(ids: CategoryId[]): Promise<{ exists: CategoryId[]; not_exists: CategoryId[] }> {
        return Promise.resolve({exists: [], not_exists: []});
    }

    findByIds(ids: CategoryId[]): Promise<Category[]> {
        return Promise.resolve([]);
    }
}