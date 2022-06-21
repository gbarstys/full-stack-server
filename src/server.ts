import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouther from './routers/auth-router';
import config from './config';

const server = express();

// Middlewares
server.use(cors()); // Leidžiame bendrauti su visais.
server.use(morgan(':method :url :status'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/auth', authRouther);

mongoose.connect(
  config.db.connectionUrl,
  {
    retryWrites: true,
    w: 'majority',
  },
  (error) => {
    if (error) {
      console.log(`Nepavyko Prisijungti:\n${error.message}`);
      return;
    }
    console.log('Successfully connected to MongoDB');
    server.listen(1338, () => console.log('Appliaction server is running on: http://localhost:1338'));
  },
);
