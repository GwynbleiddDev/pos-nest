import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty } from 'class-validator';


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty({message: 'El nombre de la Categoría no puede ir vacio'})
  name: string
}
