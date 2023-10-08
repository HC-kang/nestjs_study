import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Signup verify token',
    example: '4725d0d0-d1e5-11ed-b9d4-ab241f977b20',
  })
  @IsString()
  signupVerifyToken: string;
}
