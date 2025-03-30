import {InMemoryRepository} from "../in-memory.repository";
import {Entity} from "../../../../domain/entity";
import {Uuid} from "../../../../domain/value-objects/uuid.vo";
import {NotFoundError} from "../../../../domain/errors/not-found.error";

type StubEntityProps = {
    entity_id?: Uuid;
    name: string;
    price: number;
}

class StubEntity extends Entity {
    entity_id: Uuid;
    name: string;
    price: number;

    constructor(props: StubEntityProps) {
        super();
        this.entity_id = props.entity_id || new Uuid();
        this.name = props.name;
        this.price = props.price;
    }

    toJSON() {
        return {
            entity_id: this.entity_id.id,
            name: this.name,
            price: this.price,
        }
    }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
    getEntity(): { new(...args: any[]): StubEntity } {
        return StubEntity;
    }
}

describe('InMemoryRepository Unit Tests', () => {
    let repository: StubInMemoryRepository;

    beforeEach(() => {
        repository = new StubInMemoryRepository();
    });

    test('should insert a new entity', async () => {
        const entity = new StubEntity({name: 'Test', price: 100});

        await repository.insert(entity);

        expect(repository.items.length).toEqual(1);
        expect(repository.items[0].entity_id).toEqual(entity.entity_id);
    });

    test('should bulk insert entities', async () => {
        const entity1 = new StubEntity({name: 'Test 1', price: 100});
        const entity2 = new StubEntity({name: 'Test 2', price: 200});

        await repository.bulkInsert([entity1, entity2]);

        expect(repository.items.length).toEqual(2);
        expect(repository.items[0].entity_id).toEqual(entity1.entity_id);
        expect(repository.items[1].entity_id).toEqual(entity2.entity_id);
    });

    test('should find all entities', async () => {
        const entity1 = new StubEntity({name: 'Test 1', price: 100});
        const entity2 = new StubEntity({name: 'Test 2', price: 200});
        repository.items.push(entity1, entity2);

        const entities = await repository.findAll();

        expect(entities.length).toEqual(2);
        expect(entities[0].entity_id).toEqual(entity1.entity_id);
        expect(entities[1].entity_id).toEqual(entity2.entity_id);
    });

    test('should return empty array when no entities found', async () => {
        const entities = await repository.findAll();
        expect(entities.length).toEqual(0);
    });

    test('should find entity by id', async () => {
        const entity1 = new StubEntity({name: 'Test 1', price: 100});
        const entity2 = new StubEntity({name: 'Test 2', price: 200});
        await repository.bulkInsert([entity1, entity2]);

        const entityFound = await repository.findById(entity2.entity_id);
        expect(entityFound!.entity_id).toEqual(entity2.entity_id);
    });

    test('should return null when entity not found by id', async () => {
        const entity = new StubEntity({name: 'Test', price: 100});
        const entity2 = new StubEntity({name: 'Test 2', price: 200});

        await repository.insert(entity);

        const entityFound = await repository.findById(entity2.entity_id);
        expect(entityFound).toBeNull();
    });

    test('should update an entity', async () => {
        const entity = new StubEntity({name: 'Test', price: 100});
        await repository.insert(entity);

        entity.name = 'Updated Test';
        entity.price = 200;

        await repository.update(entity);

        const entityFound = await repository.findById(entity.entity_id);
        expect(entityFound!.name).toEqual('Updated Test');
        expect(entityFound!.price).toEqual(200);
    });

    test('should throw NotFoundError when updating non-existing entity', async () => {
        const entity = new StubEntity({name: 'Test', price: 100});

        await expect(repository.update(entity)).rejects.toThrow(NotFoundError);
    });

    test('should delete an entity', async () => {
        const entity = new StubEntity({name: 'Test', price: 100});
        await repository.insert(entity);

        await repository.delete(entity.entity_id);

        const entityFound = await repository.findById(entity.entity_id);
        expect(entityFound).toBeNull();
    });

    test('should throw NotFoundError when deleting non-existing entity', async () => {
        const entity = new StubEntity({name: 'Test', price: 100});

        await expect(repository.delete(entity.entity_id)).rejects.toThrow(NotFoundError);
    });
});