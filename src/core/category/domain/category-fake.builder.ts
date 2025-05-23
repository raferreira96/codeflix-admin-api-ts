import {Category, CategoryId} from "./category.aggregate";
import {Chance} from "chance";

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
    private _category_id: PropOrFactory<CategoryId> | undefined = undefined;
    private _name: PropOrFactory<string> = (_index) => this.chance.word({ length: 15 });
    private _description: PropOrFactory<string | null> = (_index) => this.chance.paragraph().substring(0, 255);
    private _is_active: PropOrFactory<boolean> = (_index) => true;
    private _created_at: PropOrFactory<Date> | undefined = undefined;

    private countObjs;

    static aCategory() {
        return new CategoryFakeBuilder<Category>();
    }

    static theCategories(countObjs: number) {
        return new CategoryFakeBuilder<Category[]>(countObjs);
    }

    private chance;

    private constructor(countObjs: number = 1) {
        this.countObjs = countObjs;
        this.chance = Chance();
    }

    withCategoryId(valueOrFactory: PropOrFactory<CategoryId>) {
        this._category_id = valueOrFactory;
        return this;
    }

    withName(valueOrFactory: PropOrFactory<string>) {
        this._name = valueOrFactory;
        return this;
    }

    withDescription(valueOrFactory: PropOrFactory<string | null>) {
        this._description = valueOrFactory;
        return this;
    }

    activate() {
        this._is_active = true;
        return this;
    }

    deactivate() {
        this._is_active = false;
        return this;
    }

    withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
        this._created_at = valueOrFactory;
        return this;
    }

    withInvalidNameTooShort(value?: string) {
        this._name = value ?? this.chance.word({ length: 3 });
        return this;
    }

    withInvalidNameTooLong(value?: string) {
        this._name = value ?? this.chance.word({ length: 256 });
        return this;
    }

    build(): TBuild {
        const categories = new Array(this.countObjs)
            .fill(undefined)
            .map((_, index) => {
                const category = new Category({
                    category_id: !this._category_id
                        ? undefined
                        : this.callFactory(this._category_id, index),
                    name: this.callFactory(this._name, index),
                    description: this.callFactory(this._description, index),
                    is_active: this.callFactory(this._is_active, index),
                    ...(this._created_at && {
                        created_at: this.callFactory(this._created_at, index),
                    }),
                });
                category.validate();
                return category;
            });
        return this.countObjs === 1 ? (categories[0] as any) :  categories as TBuild;
    }

    get category_id() {
        return this.getValue('category_id');
    }

    get name() {
        return this.getValue('name');
    }

    get description() {
        return this.getValue('description');
    }

    get is_active() {
        return this.getValue('is_active');
    }

    get created_at() {
        return this.getValue('created_at');
    }

    private getValue(prop: any) {
        const optional = ['category_id', 'created_at'];
        const privateProp = `_${prop}` as keyof this;
        if (!this[privateProp] && optional.includes(prop)) {
            throw new Error(`Property ${prop} not have a factory, use 'with' methods.`);
        }
        return this.callFactory(this[privateProp], 0);
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function'
            ? factoryOrValue(index)
            : factoryOrValue;
    }
}