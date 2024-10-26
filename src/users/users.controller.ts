import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  @ApiTags('auth')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  @ApiTags('auth')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signin')
  @ApiTags('auth')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/whoami')
  @ApiTags('auth')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User, @Session() session: any) {
    if (!user) {
      session.userId = null;
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/users/:id')
  @ApiTags('users')
  @UseGuards(AdminGuard)
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get('/users')
  @ApiTags('users')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'email', required: false })
  getUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/users/:id')
  @ApiTags('users')
  @UseGuards(AdminGuard)
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/users/:id')
  @ApiTags('users')
  @UseGuards(AdminGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
