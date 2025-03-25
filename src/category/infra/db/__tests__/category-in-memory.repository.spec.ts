import {CategoryInMemoryRepository} from "../category-in-memory.repository";
import {Category} from "../../../domain/category.entity";

describe('CategoryInMemoryRepository Unit Tests', () => {
    let repository: CategoryInMemoryRepository;

    beforeEach(() => { repository = new CategoryInMemoryRepository(); });

    test('should no filter items when filter object is null', async () => {
        const items = [Category.create({ name: 'Test'})];
        const filterSpy = jest.spyOn(items, 'filter' as any);

        const itemsFitered = await repository['applyFilter'](items, null);
        expect(filterSpy).not.toHaveBeenCalled();
        expect(itemsFitered).toStrictEqual(items);
    });

    test('should filter items using filter parameter', async () => {
        const items = [
            Category.create({ name: 'Test'}),
            Category.create({ name: 'TEST'}),
            Category.create({ name: 'fake'}),
        ];

        const filterSky = jest.spyOn(items, 'filter' as any);

        const itemsFIltered = await repository['applyFilter'](items, 'TEST');
        expect(filterSky).toHaveBeenCalledTimes(1);
        expect(itemsFIltered).toStrictEqual([items[0], items[1]]);
    });

    test('should sort by created_at when sort param is null', async () => {
        const created_at = new Date();
        const items = [
            Category.create({ name: 'Test 1', created_at}),
            Category.create({ name: 'Test 2', created_at: new Date(created_at.getTime() + 1)}),
            Category.create({ name: 'Test 3', created_at: new Date(created_at.getTime() + 2)}),
        ];

        const itemsSorted = await repository['applySort'](items, null, null);
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    test('should sort by name', async () => {
        const items = [
            Category.create({ name: 'CTest' }),
            Category.create({ name: 'BTest' }),
            Category.create({ name: 'ATest' }),
        ];

        const itemsSorted = await repository['applySort'](items, 'name', 'asc');
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });
});