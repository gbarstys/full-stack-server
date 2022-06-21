import {
  Schema,
  Model,
  Types,
  Document,
  model,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export type Admin = {
  email: string,
  password: string,
  createdAt: string,
  updatedAt: string,
};

export type AdminProps = Omit<Admin, 'createdAt' | 'updatedAt'>;

export type AdminDocument = (Document<Types.ObjectId, unknown, Admin> & Admin & {
  _id: Types.ObjectId;
});

type AdminModelType = Model<Admin>;

const adminSchema = new Schema<Admin, AdminModelType>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

adminSchema.plugin(uniqueValidator);

const AdminModel = model('Admin', adminSchema);

export default AdminModel;
