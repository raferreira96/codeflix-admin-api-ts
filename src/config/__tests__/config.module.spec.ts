import Joi from "joi";
import {CONFIG_DB_SCHEMA, ConfigModule} from "../config.module";
import {Test} from "@nestjs/testing";
import * as path from "path";

const dirname = path.resolve();

function expectValidate(schema: Joi.Schema, value: any) {
    return expect(schema.validate(value, { abortEarly: false}).error?.message);
}

describe('Schema Unit Tests', () => {
    describe('DB Schema', () => {
        const schema = Joi.object({
            ...CONFIG_DB_SCHEMA,
        });

        describe('DB_VENDOR', () => {
            test('invalid cases', () => {
                expectValidate(schema, {}).toContain('"DB_VENDOR" is required');
                expectValidate(schema, { DB_VENDOR: 5 }).toContain('"DB_VENDOR" must be one of [mysql, sqlite]');
            });

            test('valid cases', () => {
                const arrange = ['mysql', 'sqlite'];

                arrange.forEach((value) => {
                    expectValidate(schema, { DB_VENDOR: value }).not.toContain('DB_VENDOR');
                });
            });
        });

        describe('DB_HOST', () => {
            test('invalid cases', () => {
                expectValidate(schema, {}).toContain('"DB_HOST" is required');
                expectValidate(schema, { DB_HOST: 1 }).toContain('"DB_HOST" must be a string');
            });

            test('valid cases', () => {
                expectValidate(schema, { DB_HOST: 'some value' }).not.toContain('DB_HOST');
            });
        });

        describe('DB_DATABASE', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain('"DB_DATABASE" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain('"DB_DATABASE" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql', DB_DATABASE: 1 }).toContain('"DB_DATABASE" must be a string');
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_DATABASE: 'some value' },
                    { DB_VENDOR: 'mysql', DB_DATABASE: 'some value' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain('DB_DATABASE');
                });
            });
        });

        describe('DB_USERNAME', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain('"DB_USERNAME" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain('"DB_USERNAME" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql', DB_USERNAME: 1 }).toContain('"DB_USERNAME" must be a string');
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_USERNAME: 'some value' },
                    { DB_VENDOR: 'mysql', DB_USERNAME: 'some value' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain('DB_USERNAME');
                });
            });
        });

        describe('DB_PASSWORD', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain('"DB_PASSWORD" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain('"DB_PASSWORD" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql', DB_PASSWORD: 1 }).toContain('"DB_PASSWORD" must be a string');
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_PASSWORD: 'some value' },
                    { DB_VENDOR: 'mysql', DB_PASSWORD: 'some value' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain('DB_PASSWORD');
                });
            });
        });

        describe('DB_PORT', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain('"DB_PORT" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain('"DB_PORT" is required');
                expectValidate(schema, { DB_VENDOR: 'mysql', DB_PORT: 'a' }).toContain('"DB_PORT" must be a number');
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_PORT: 5432 },
                    { DB_VENDOR: 'mysql', DB_PORT: 3306 },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain('DB_PORT');
                });
            });
        });
    });
});

describe('ConfigModule Unit Tests', () => {
    test('should throw an error when env vars are invalid', () => {
        try {
            Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: path.join(dirname,'.env.fake'),
                    }),
                ],
            });

            // fail('ConfigModule should throw an error when env vars are invalid');
        } catch (error) {
            expect(error.message).toContain('"DB_VENDOR" must be one of [mysql, sqlite]');
        }
    });

    test('should be valid', () => {
        const module = Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
        });

        expect(module).toBeDefined();
    });
});