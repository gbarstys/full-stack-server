import { Error } from 'mongoose';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminModel, { AdminProps } from '../models/admin-model';
import config from '../config';
import createAdminViewModel, { AdminViewModel } from '../view-model-creators/create-admin-view-model';

type AuthResponseBody = {
  admin: AdminViewModel,
  token: string,
} | ErrorResponseBody;

export const login: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<AdminProps>
> = async (req, res) => {
  // NAUJAM ADMINUI SUKURTI:
  //   const { email, password } = req.body;

  //   if (!email) throw new Error('Privalomas el. paštas');
  //   if (!password) throw new Error('Privalomas slaptažodis');

  //   const admin = await AdminModel.create({
  //     email,
  //     password: bcrypt.hashSync(password, 5),
  //   });

  //   const token = jwt.sign({ email }, config.token.secret);

  //   res.status(200).send({
  //     admin: createAdminViewModel(admin),
  //     token: `Bearer ${token}`,
  //   });
  // };

  const { email, password } = req.body;

  try {
    if (!email) throw new Error('Privalomas el. paštas');
    if (!password) throw new Error('Privalomas slaptažodis');

    const adminDoc = await AdminModel.findOne({ email });
    if (adminDoc === null) throw new Error(`Adminas su paštu '${email}' nerastas`);

    const passwordIsCorrect = bcrypt.compareSync(password, adminDoc.password);

    if (!passwordIsCorrect) throw new Error('Slaptažodis neteisingas');
    const token = jwt.sign({ email }, config.token.secret);

    res.status(200).json({
      admin: createAdminViewModel(adminDoc),
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Serverio klaida prisijungiant',
    });
  }
};

export const authenticate: RequestHandler<unknown, AuthResponseBody> = async (req, res) => {
  try {
    if (req.tokenData === undefined) {
      throw new Error('Užšifruotuose duomenyse nėra vartotojo duomenų');
    }
    const { email, token } = req.tokenData;
    const adminDoc = await AdminModel.findOne({ email });

    if (adminDoc === null) {
      throw new Error(`Vartotojas nerastas su tokiu paštu ${email}`);
    }

    const admin = createAdminViewModel(adminDoc);

    res.status(200).json({
      admin,
      token,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Serverio klaida atpažįstant vartotoją',
    });
  }
};
