import { IsString, IsNotEmpty, Length, Matches } from 'class-validator'

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'Room ID must be exactly 10 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Room ID must contain only letters and numbers',
  })
  roomId: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username: string
}

