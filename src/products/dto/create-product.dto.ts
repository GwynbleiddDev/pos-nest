import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"


export class CreateProductDto {
  @IsNotEmpty({message: 'El Nombre del Producto es Obligatorio'})
  @IsString({message: 'Nombre no válido'})
  name: string

  @IsNotEmpty({message: 'El Precio del Producto es Obligatorio'})
  @IsNumber({maxDecimalPlaces: 2}, {message: 'Precio no válido'})
  price: number

  @IsNotEmpty({message: 'La cantidad no puede ir vacia'})
  @IsNumber({maxDecimalPlaces: 0}, {message: 'Cantidad no válida'})
  inventory: number
  
  @IsNotEmpty({message: 'La categoría es obligatoria'})
  @IsInt({message: 'La categoría no es válida'})
  categoryId: number
}
