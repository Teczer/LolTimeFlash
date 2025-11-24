import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 12;

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'Room ID must be exactly 10 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Room ID must contain only letters and numbers',
  })
  roomId: string;

  @IsString()
  @IsNotEmpty()
  @Length(MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, {
    message: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`,
  })
  username: string;
}
