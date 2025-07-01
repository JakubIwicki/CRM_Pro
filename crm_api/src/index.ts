import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

//.env
require('dotenv').config();

const app = express()

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.send('Hello from psweb!');
});

// Parameters
const is_dev = process.env.DEV_MODE == "true";
const apiPrefix = process.env.API_PREFIX || '/api';
const port = process.env.PORT || 3000;
const url = process.env.URL || 'http://localhost';

// Routes
import authRoutes from './routes/auth_routes';
app.use(apiPrefix + '/auth/', authRoutes);

import infoRoutes from './routes/info';
app.use(apiPrefix + '/info', infoRoutes);

import userRoutes from './routes/user_routes';
app.use(apiPrefix + '/users', userRoutes);

import clientRoutes from './routes/clients';
app.use(apiPrefix + '/clients', clientRoutes);

import orderRoutes from './routes/orders';
app.use(apiPrefix + '/orders', orderRoutes);

import serviceRoutes from './routes/services';
app.use(apiPrefix + '/services', serviceRoutes);

import productRoutes from './routes/products';
app.use(apiPrefix + '/products', productRoutes);

// Start the server
app.listen(port, () => {
    if (is_dev) {
        app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
    console.log(`Server is running on ${url}:${port}`);
});