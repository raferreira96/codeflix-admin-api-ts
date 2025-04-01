import {SortDirection} from "@core/shared/domain/repository/search-params";

export class SearchCategoriesDto {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    filter?: string;
}