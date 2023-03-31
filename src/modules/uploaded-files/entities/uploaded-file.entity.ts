import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'uploaded_files' })
export class UploadedFileEntity {
  @ApiProperty({ example: 'a020f519-42c5-4eed-9c4a-ff389c06e352' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  width: number;

  @ApiProperty()
  @Column()
  height: number;

  @ApiProperty()
  @Column()
  mime: string;

  @Allow()
  @Column()
  path: string;

  @ApiProperty()
  @Column()
  filename: string;

  @ApiProperty()
  @Column()
  size: number;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deleted_at: Date;
}
