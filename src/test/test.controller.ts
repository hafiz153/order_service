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
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { PaginationFilterDto } from 'src/common/dto/paginate.dto';
import { Test } from './entities/test.entity';

@ApiTags('Tests') // Group APIs under "Tests"
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new test record' })
  @ApiResponse({
    status: 201,
    description: 'Test record created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  async create(@Body() createTestDto: CreateTestDto): Promise<any> {
    return await this.testService.create(createTestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all test records with pagination' })
  @ApiResponse({ status: 200, description: 'List of test records.' })
  findAll(@Query() query: PaginationFilterDto) {
    return this.testService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific test record by ID' })
  @ApiResponse({ status: 200, description: 'Test record found.' })
  @ApiResponse({ status: 404, description: 'Test record not found.' })
  findOne(@Param('id') id: string) {
    return this.testService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing test record' })
  @ApiResponse({
    status: 200,
    description: 'Test record updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  @ApiResponse({ status: 404, description: 'Test record not found.' })
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(id, updateTestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a test record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Test record deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Test record not found.' })
  remove(@Param('id') id: string) {
    return this.testService.remove(id);
  }
}
