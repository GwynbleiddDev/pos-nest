import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll( @Query('transactionDate') transactionDate: string) {
    
    return this.transactionsService.findAll(transactionDate);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.transactionsService.remove(+id);
  }
}
