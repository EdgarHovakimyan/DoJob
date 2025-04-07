import { Controller, Get,  Body, Patch, Param, Delete, UseGuards, Res, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UpdateUserImgDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(@Res() res:Response) {
    try{
      const data = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res:Response) {
    try{
      const data = await this.userService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Res() res:Response) {
    try{
      const data = await this.userService.update(+id, updateUserDto);
      return res.status(HttpStatus.CREATED).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Res() res: Response
  ) {
    try {
      const data = await this.userService.updatePassword(+id, updateUserPasswordDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/image')
  async updateImage(
    @Param('id') id: string,
    @Body() updateUserImgDto: UpdateUserImgDto,
    @Res() res: Response
  ) {
    try {
      const data = await this.userService.updateImage(+id, updateUserImgDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res:Response) {
    try{
      const data = await this.userService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
}
