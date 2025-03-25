import { InMemorySearchableRepository} from "../../../shared/infra/db/in-memory/in-memory.repository";
import {Uuid} from "../../../shared/domain/value-objects/uuid.vo";
import {Category} from "../../domain/category.entity";
import {SortDirection} from "../../../shared/domain/repository/search-params";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category, Uuid> {
    sortableFields: string[] = ['name', 'created_at'];

    getEntity(): { new(...args: any[]): Category } {
        return Category;
    }

    protected async applyFilter(items: Category[], filter: string): Promise<Category[]> {
        if (!filter) {
            return items;
        }

        return items.filter((item) => {
            return item.name.toLowerCase().includes(filter.toLowerCase());
        });
    }

    protected applySort(
        items: Category[],
        sort: string | null,
        sort_dir: SortDirection | null,
    ) {
        return sort
            ? super.applySort(items, sort, sort_dir)
            : super.applySort(items, 'created_at', 'desc');
    }
}