import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories/categories.module';
import { DatabaseModule } from './nest-modules/database/database.module';
import { ConfigModule } from './nest-modules/config/config.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      DatabaseModule,
      CategoriesModule,
      ConfigModule,
      SharedModule,
  ],
})
export class AppModule {}
