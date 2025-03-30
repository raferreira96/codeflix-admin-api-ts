import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import {SequelizeModule} from "@nestjs/sequelize";
import {CategoryModel} from "@core/category/infra/db/sequelize/category.model";
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      DatabaseModule,
      CategoriesModule,
      ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
