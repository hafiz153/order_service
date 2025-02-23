import { PartialType } from '@nestjs/swagger';
import { CreateCustomFlexDto } from './create-customFlex.dto';

export class UpdateCustomFlexDto extends PartialType(CreateCustomFlexDto) {}
