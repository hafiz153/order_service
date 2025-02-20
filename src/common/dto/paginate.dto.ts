import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationFilterDto {
  @ApiPropertyOptional({
    description: 'Filter criteria as a dynamic JSON object',
    type: Object,
    example: { name: 'hafiz', email: 'hafiz@gmail.com' },
  })
  @IsOptional()
  filter?: Record<string, any>;


  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sorting field (e.g., "createdAt:desc")',
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Total number of records', example: 100 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Next page number if available, otherwise null', example: 2, nullable: true })
  nextPage: number | null;

  @ApiProperty({ description: 'Current page number', example: 1 })
  pageNumber: number;

  @ApiProperty({ description: 'Data records for the current page', isArray: true })
  items: T[];

  constructor(
    total: number,
    totalPages: number,
    nextPage: number | null,
    pageNumber: number,
    items: T[],
  ) {
    this.total = total;
    this.totalPages = totalPages;
    this.nextPage = nextPage;
    this.pageNumber = pageNumber;
    this.items = items;
  }
}

