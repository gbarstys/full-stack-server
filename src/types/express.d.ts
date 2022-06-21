import { AdminDocument } from '../models/admin-model';

declare global {
  declare namespace Express {
    export interface Request {
      tokenData?: {
        email: string,
        token: string,
      },
      authAdmin: AdminDocument
    }
  }

}
export { };
