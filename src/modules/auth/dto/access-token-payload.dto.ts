import { TOKEN_TYPE } from '@/common/resources';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class AccessTokenPayload {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  type: TOKEN_TYPE;

  @ApiProperty()
  role: UserRole;
}
