import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'uploaded_files' })
export class UploadedFileEntity {
  @ApiProperty({ example: 'a020f519-42c5-4eed-9c4a-ff389c06e352' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Allow()
  @Column()
  path: string;

  @ApiProperty()
  @Column()
  width: number;

  @ApiProperty()
  @Column()
  height: number;
  @ApiProperty()
  @Column()
  mime: string;

  @ApiProperty()
  @Column()
  filename: string;
  @ApiProperty()
  @Column()
  size: number;

  @ApiProperty()
  @Column()
  url: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = process.env.AZURE_CDN_URL + this.path;
    }
  }
}
