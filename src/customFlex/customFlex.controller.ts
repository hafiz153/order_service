import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCustomFlexDto } from './dto/create-customFlex.dto';
import { UpdateCustomFlexDto } from './dto/update-customFlex.dto';
import { PaginationFilterDto } from 'src/common/dto/paginate.dto';
import { CustomFlexService } from './customFlex.service';

@ApiTags('CustomFlex - Custom subscription pricing for individual user') // Group APIs under "CustomFlex"
@Controller('customFlex')
export class CustomFlexController {
  constructor(private readonly customFlexService: CustomFlexService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customFlex record' })
  @ApiResponse({
    status: 201,
    description: 'CustomFlex record created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  async create(@Body() createCustomFlexDto: CreateCustomFlexDto): Promise<any> {
    return await this.customFlexService.create(createCustomFlexDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customFlex records with pagination' })
  @ApiResponse({ status: 200, description: 'List of customFlex records.' })
  findAll(@Query() query: PaginationFilterDto) {
    return this.customFlexService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific customFlex record by ID' })
  @ApiResponse({ status: 200, description: 'CustomFlex record found.' })
  @ApiResponse({ status: 404, description: 'CustomFlex record not found.' })
  findOne(@Param('id') id: string) {
    return this.customFlexService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing customFlex record' })
  @ApiResponse({
    status: 200,
    description: 'CustomFlex record updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  @ApiResponse({ status: 404, description: 'CustomFlex record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCustomFlexDto: UpdateCustomFlexDto,
  ) {
    return this.customFlexService.update(id, updateCustomFlexDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customFlex record by ID' })
  @ApiResponse({
    status: 200,
    description: 'CustomFlex record deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'CustomFlex record not found.' })
  remove(@Param('id') id: string) {
    return this.customFlexService.remove(id);
  }
}
