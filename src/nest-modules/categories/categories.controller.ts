import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus, Query
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {CreateCategoryUseCase} from "@core/category/application/use-cases/create/create-category.use-case";
import {GetCategoryUseCase} from "@core/category/application/use-cases/get/get-category.use-case";
import {
  ListCategoriesInput,
  ListCategoriesUseCase
} from "@core/category/application/use-cases/list/list-categories.use-case";
import {UpdateCategoryUseCase} from "@core/category/application/use-cases/update/update-category.use-case";
import {DeleteCategoryUseCase} from "@core/category/application/use-cases/delete/delete-category.use-case";
import {CategoryCollectionPresenter, CategoryPresenter} from "./categories.presenter";
import {CategoryOutput} from "@core/category/application/use-cases/common/category-output";
import {SearchCategoriesDto} from "./dto/search-categories.dto";

@Controller('categories')
export class CategoriesController {

  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getCategoryUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listCategoriesUseCase: ListCategoriesUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateCategoryUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteCategoryUseCase: DeleteCategoryUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCategoriesDto) {
    const output = await this.listCategoriesUseCase.execute(searchParamsDto as ListCategoriesInput);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getCategoryUseCase.execute({ id });
    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const output = await this.updateCategoryUseCase.execute({...updateCategoryDto, id});
    return CategoriesController.serialize(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    return this.deleteCategoryUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
