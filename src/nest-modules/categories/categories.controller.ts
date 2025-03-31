import {Controller, Get, Post, Body, Patch, Param, Delete, Inject} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {CreateCategoryUseCase} from "@core/category/application/use-cases/create/create-category.use-case";
import {GetCategoryUseCase} from "@core/category/application/use-cases/get/get-category.use-case";
import {ListCategoriesUseCase} from "@core/category/application/use-cases/list/list-categories.use-case";
import {UpdateCategoryUseCase} from "@core/category/application/use-cases/update/update-category.use-case";
import {DeleteCategoryUseCase} from "@core/category/application/use-cases/delete/delete-category.use-case";
import {CreateCategoryInput} from "@core/category/application/use-cases/create/create-category.input";
import {CategoryPresenter} from "./categories.presenter";
import {CategoryOutput} from "@core/category/application/use-cases/common/category-output";

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
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
