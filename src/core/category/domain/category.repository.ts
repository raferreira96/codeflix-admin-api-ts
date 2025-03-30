import {ISearchableRepository} from "../../shared/domain/repository/repository.interface";
import {Category} from "./category.entity";
import {Uuid} from "../../shared/domain/value-objects/uuid.vo";
import {SearchParams} from "../../shared/domain/repository/search-params";
import {SearchResult} from "../../shared/domain/repository/search-result";

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository extends ISearchableRepository<Category, Uuid, CategoryFilter, CategorySearchParams, CategorySearchResult> {

}