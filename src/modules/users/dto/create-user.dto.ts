import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @Transform(({ value, obj }) => {
    if (obj.password.includes(obj.name.trim())) {
      throw new Error('Password cannot contain name');
    }
    return value.trim();
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsString()
  @MaxLength(60)
  readonly email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'test1234',
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
