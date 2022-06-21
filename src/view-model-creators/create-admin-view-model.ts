import { Admin, AdminDocument } from '../models/admin-model';

export type AdminViewModel = Omit<Admin, 'password'> & {
  id: string;
};

const createAdminViewModel = (adminDoc: AdminDocument): AdminViewModel => ({
  id: adminDoc._id.toString(),
  email: adminDoc.email,
  createdAt: adminDoc.createdAt,
  updatedAt: adminDoc.updatedAt,
});

export default createAdminViewModel;
