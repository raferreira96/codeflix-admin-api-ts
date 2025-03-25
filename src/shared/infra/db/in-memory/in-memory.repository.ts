import {IRepository} from "../../../domain/repository/repository.interface";
import {Entity} from "../../../domain/entity";
import {ValueObject} from "../../../domain/value-object";
import {NotFoundError} from "../../../domain/errors/not-found.error";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E, EntityId> {
    items: E[] = [];

    async bulkInsert(entities: E[]): Promise<void> {
        this.items.push(...entities);
    }

    async delete(entity_id: EntityId): Promise<void> {
        const indexFound = this.items.findIndex((item) => item.entity_id.equals(entity_id));
        if (indexFound === -1) {
            throw new NotFoundError(entity_id, this.getEntity());
        }
        this.items.splice(indexFound, 1);
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }

    async findById(entity_id: EntityId): Promise<E | null> {
        const item = this.items.find((item) => item.entity_id.equals(entity_id));
        return typeof item === 'undefined' ? null : item;
    }

    abstract getEntity(): new (...args: any[]) => E;

    async insert(entity: any): Promise<void> {
        this.items.push(entity);
    }

    async update(entity: E): Promise<void> {
        const indexFound = this.items.findIndex((item) => item.entity_id.equals(entity.entity_id));
        if (indexFound === -1) {
            throw new NotFoundError(entity.entity_id, this.getEntity());
        }
        this.items[indexFound] = entity;
    }
}