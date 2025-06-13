import { IsNotEmpty } from "class-validator";


export class CreateCategoryDto {
  @IsNotEmpty({message: 'El Nombre no puede ir vacio'})
  name: string
}
