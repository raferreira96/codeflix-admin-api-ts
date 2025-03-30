import {InvalidUuidError, Uuid} from "../uuid.vo";

describe('Uuid Unit Tests', () => {
    const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

    test('should throw InvalidUuidError when uuid is invalid', () => {
        expect(() => new Uuid('invalid-uuid')).toThrowError(InvalidUuidError);
        expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a valid uuid', () => {
        const uuid = new Uuid();
        expect(uuid.id).toBeDefined();
        expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a valid uuid with provided id', () => {
        const uuid = new Uuid('b4c8b0c6-0e3b-4a6d-9e4d-0c1c2e2b4e4d');
        expect(uuid.id).toBe('b4c8b0c6-0e3b-4a6d-9e4d-0c1c2e2b4e4d');
        expect(validateSpy).toHaveBeenCalledTimes(1);
    });
});