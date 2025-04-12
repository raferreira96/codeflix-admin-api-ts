import {Sequelize} from "sequelize-typescript";
import {SequelizeStorage, Umzug, UmzugOptions} from "umzug";
import {join} from "path";
import path from "path";

const dirname = path.resolve();

export function migrator(sequelize: Sequelize, options: Partial<UmzugOptions>) {
    return new Umzug({
        migrations: {
            glob: [
                '*/infra/db/sequelize/migrations/*.{js,ts}',
                {
                    cwd: join(dirname, '..', '..', '..', '..'),
                    ignore: ['**/*.d.ts', '**/index.ts', '**/index.js'],
                }
            ],
        },
        context: sequelize,
        storage: new SequelizeStorage({sequelize}),
        logger: console,
        ...(options || {}),
    });
}