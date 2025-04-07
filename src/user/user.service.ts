import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserImgDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import path from 'path';



@Injectable()
export class UserService {

  constructor(@InjectModel("User")private userModel:Model<User>){}

  async create(createUserDto: CreateUserDto) {
    const { first_name, last_name, age, email, password, phoneNumber, role } =
      createUserDto;
    const us = await this.userModel.findOne({ email });
    if (us) {
      throw new BadRequestException('User not found with that email' );
    }
    const user = await this.userModel.create({
      first_name,
      last_name,
      age,
      email,
      password: bcrypt.hashSync(password, 10),
      phoneNumber,
      role,
    });
    return user;
  }

  async findUserByEmail(username: string) {
      return await this.userModel.findOne({ username });
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: number) {
    return await this.userModel.findOne({  where:{id} });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findOne({ where: { id } });

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    return await this.userModel.findByIdAndUpdate(updateUserDto);
  }

  async updateImage(id: number, updateUserImgDto: UpdateUserImgDto) {
    const updatedUser = await this.userModel.findOne({ where: { id } });

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    if (updatedUser.image) {
      const filePath = path.join(__dirname, '..', 'uploads', updatedUser.image);
        await fs.unlink(filePath);
    }
    return await this.userModel.findByIdAndUpdate(updateUserImgDto);
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { oldPassword, password, confirmPassword } = updateUserPasswordDto;

    if (!oldPassword || !password || !confirmPassword) {
      throw new BadRequestException('All password fields are required!');
    }

    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect!');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await this.userModel.findByIdAndUpdate(user);

    return { message: 'Password updated successfully', user };
  }



  async remove(id: number) {
    const us = await this.userModel.findById({ where: { id } });
    if (!us) {
      return false;
    }
    await this.userModel.findByIdAndDelete(us);
    return true;
  }
}
