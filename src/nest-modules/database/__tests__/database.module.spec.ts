import {Test} from "@nestjs/testing";
import {DatabaseModule} from "../database.module";
import {ConfigModule} from "../../config/config.module";
import {Sequelize} from "sequelize-typescript";
import {getConnectionToken} from "@nestjs/sequelize";

describe('DatabaseModule Unit Tests', () => {
    describe('sqlite connection', () => {
        const connectionOptions = {
            DB_VENDOR: 'sqlite',
            DB_HOST: ':inmemory:',
            DB_LOGGING: false,
            DB_AUTO_LOAD_MODELS: true,
        };

        test('should be a sqlite connection', async () => {
            const module = await Test.createTestingModule({
                imports: [
                    DatabaseModule,
                    ConfigModule.forRoot({
                        isGlobal: true,
                        ignoreEnvFile: true,
                        ignoreEnvVars: true,
                        validationSchema: null,
                        load: [() => connectionOptions],
                    }),
                ],
            }).compile();

            const app = module.createNestApplication();
            const connection = app.get<Sequelize>(getConnectionToken());
            expect(connection).toBeDefined();
            expect(connection.options.dialect).toBe('sqlite');
            expect(connection.options.host).toBe(':inmemory:');
            await connection.close();
        });
    });

    describe('mysql connection', () => {
        const connectionOptions = {
            DB_VENDOR: 'mysql',
            DB_HOST: 'db',
            DB_DATABASE: 'codeflix',
            DB_USERNAME: 'root',
            DB_PASSWORD: 'root',
            DB_PORT: 3306,
            DB_LOGGING: false,
            DB_AUTO_LOAD_MODELS: true,
        };

        test('should be a mysql connection', async () => {
            const module = await Test.createTestingModule({
                imports: [
                    DatabaseModule,
                    ConfigModule.forRoot({
                        isGlobal: true,
                        ignoreEnvFile: true,
                        ignoreEnvVars: true,
                        validationSchema: null,
                        load: [() => connectionOptions],
                    }),
                ],
            }).compile();

            const app = module.createNestApplication();
            const connection = app.get<Sequelize>(getConnectionToken());
            expect(connection).toBeDefined();
            expect(connection.options.dialect).toBe(connectionOptions.DB_VENDOR);
            expect(connection.options.host).toBe(connectionOptions.DB_HOST);
            expect(connection.options.database).toBe(connectionOptions.DB_DATABASE);
            expect(connection.options.username).toBe(connectionOptions.DB_USERNAME);
            expect(connection.options.password).toBe(connectionOptions.DB_PASSWORD);
            expect(connection.options.port).toBe(connectionOptions.DB_PORT);
            await connection.close();
        });
    });
});