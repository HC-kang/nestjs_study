import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // @Transform((params) => params.value.trim())
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

  @IsEmail()
  @IsString()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
