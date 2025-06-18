import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from 'src/coupons/coupons.service';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly couponService: CouponsService
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    
    await this.productRepository.manager.transaction( async (transactionEntityManager) => {
      
      const transaction = new Transaction()
      const total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0)
      transaction.total = total
      
      if(createTransactionDto.coupon) {
        const coupon = await this.couponService.applyCoupon(createTransactionDto.coupon)

        const discount = (coupon.percentage / 100) * total
        transaction.discount = discount
        transaction.coupon = coupon.name
        transaction.total -= discount 
      }

      for(const contents of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product, {id: contents.productId});
        
        const errors: string[] = []

        if (!product) {
          errors.push(`El producto con ID: ${contents.productId} no existe`)
          throw new NotFoundException(errors);
        }
        if(contents.quantity > product.inventory) {
          errors.push(`El articulo ${product.name} excede la cantidad disponible`)
          throw new BadRequestException(errors)
        }
        product.inventory -= contents.quantity

        // Create transactionContents instance
        const transactionContent = new TransactionContents()
        transactionContent.price = contents.price
        transactionContent.product = product
        transactionContent.quantity = contents.quantity
        transactionContent.transaction = transaction

        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContent)
      }
    })
    return 'Venta Almacenada Correctamente'
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }
    if(transactionDate) {
      const date = parseISO(transactionDate)
      if(!isValid(date)) {
        throw new BadRequestException('Fecha no válida')
      }
      const start = startOfDay(date)
      const end = endOfDay(date)

      options.where = {
        transactionDate: Between(start, end)
      }
    }
    return this.transactionRepository.find(options)
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })

    if(!transaction) {
      throw new NotFoundException('Transacción no encontrada')
    }
    return transaction
  }

  async remove(id: number) {
    const transaction = await this.findOne(id)

    for(const contents of transaction.contents) {
      const product = await this.productRepository.findOneBy({id: contents.product.id})

      const errors: string[] = []
      if (!product) {
        errors.push(`El producto con ID: ${contents.product.id} no existe`)
        throw new NotFoundException(errors);
      }
      product.inventory += contents.quantity
      await this.productRepository.save(product)

      const transactionContents = await this.transactionContentsRepository.findOneBy({id: contents.id})
      if (transactionContents) {
        await this.transactionContentsRepository.remove(transactionContents)
      }
    }

    await this.transactionRepository.remove(transaction)
    return {message: 'Venta Eliminada'}
  }
}
