import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoles } from 'src/types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;
  __v: number;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'admin' })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Override toJSON method to remove password field
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
