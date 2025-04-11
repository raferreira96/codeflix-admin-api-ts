import request from 'supertest';
import {CreateCategoryFixture} from "../../src/nest-modules/categories/testing/category-fixture";
import {ICategoryRepository} from "@core/category/domain/category.repository";
import {CATEGORY_PROVIDERS} from "../../src/nest-modules/categories/categories.providers";
import {startApp} from "../../src/nest-modules/shared-module/testing/helpers";
import {Uuid} from "@core/shared/domain/value-objects/uuid.vo";
import {CategoriesController} from "../../src/nest-modules/categories/categories.controller";
import {CategoryOutputMapper} from "@core/category/application/use-cases/common/category-output";
import {instanceToPlain} from "class-transformer";

describe('CategoriesController (e2e)', () => {
    const appHelper = startApp();
    let categoryRepository: ICategoryRepository;

    beforeEach(async () => {
        categoryRepository = appHelper.app.get<ICategoryRepository>(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
    });

    describe('/categories (POST)', () => {
        const arrange = CreateCategoryFixture.arrangeForCreate();

        describe('should return a response error with 422 status code when request body is invalid', () => {
            const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)('when body is $label', ({ value }) => {
                return request(appHelper.app.getHttpServer())
                    .post('/categories')
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });
        });

        describe('should return a response error with 422 status code when throw EntityValidationError', () => {
            const invalidRequest =
                CreateCategoryFixture.arrangeForEntityValidationError();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)('when body is $label', ({ value }) => {
                return request(appHelper.app.getHttpServer())
                    .post('/categories')
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });
        });

        describe('should create a category', () => {
            test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {
                const response = await request(appHelper.app.getHttpServer())
                    .post('/categories')
                    .send(send_data)
                    .expect(201);

                const keysInReponse = CreateCategoryFixture.keysInResponse;
                expect(Object.keys(response.body)).toStrictEqual(['data']);
                expect(Object.keys(response.body.data)).toStrictEqual(keysInReponse);
                const id = response.body.data.id;
                const categoryCreated = await categoryRepository.findById(new Uuid(id));

                const presenter = CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(categoryCreated!),
                );
                const serialized = instanceToPlain(presenter);

                expect(response.body.data).toStrictEqual({
                    id: serialized.id,
                    created_at: serialized.created_at,
                    ...expected,
                });
            });
        });
    });
});
