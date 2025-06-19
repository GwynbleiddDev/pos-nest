import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { categories } from './data/categories';
import { products } from './data/products';


@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private dataSource: DataSource
  ) {}

  async onModuleInit() {
    const connection = this.dataSource
    await connection.dropDatabase()
    await connection.synchronize()
  }

  async seed() {
    await this.categoryRepository.save(categories);
    for (const seedProduct of products) {
      const category = await this.categoryRepository.findOneBy({id: seedProduct.categoryId});
      if (!category) {
        throw new Error(`Category with id ${seedProduct.categoryId} not found`);
      }
      const product = new Product();
      product.name = seedProduct.name;
      product.image = seedProduct.image;
      product.price = seedProduct.price;
      product.inventory = seedProduct.inventory;
      product.category = category;

      await this.productRepository.save(product)
    }
  }
}