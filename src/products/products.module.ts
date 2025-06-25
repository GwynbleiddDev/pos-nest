import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { UploadImageModule } from 'src/upload-image/upload-image.module';


@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), UploadImageModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
