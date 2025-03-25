import {InMemoryRepository} from "../../../shared/infra/db/in-memory/in-memory.repository";
import {Uuid} from "../../../shared/domain/value-objects/uuid.vo";
import {Category} from "../../domain/category.entity";

export class CategoryInMemoryRepository extends InMemoryRepository<Category, Uuid> {
    getEntity(): { new(...args: any[]): Category } {
        return Category;
    }
}