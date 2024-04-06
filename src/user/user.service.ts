import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | string> {
    const createdUser = await this.userModel.create(createUserDto).catch(() => {
      throw new ConflictException('User exist');
    });

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async find(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const updateUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .catch((err) => {
        if (err.code === 11000)
          throw new ConflictException('User already exist');
        else throw new NotFoundException('Bad Request');
      });

    return updateUser;
  }
}
