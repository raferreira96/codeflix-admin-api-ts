import {Exclude, Expose} from "class-transformer";
import {PaginationPresenter, PaginationPresenterProps} from "./pagination.presenter";

export abstract class CollectionPresenter {
    @Exclude()
    protected paginationPresenter: PaginationPresenter;

    protected constructor(props: PaginationPresenterProps) {
        this.paginationPresenter = new PaginationPresenter(props);
    }

    @Expose({ name: 'meta' })
    get meta() {
        return this.paginationPresenter;
    }

    abstract get data();
}