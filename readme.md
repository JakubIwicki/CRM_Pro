# CRM Application Documentation

## Overview

The CRM Application is a full-stack system designed to manage clients, orders, products, and services. It consists of a backend API (`crm_api`) and a frontend application (`crm_pro`) that together provide a seamless interface for interacting with CRM data.

## Backend: CRM API

### Frameworks and Libraries

- **Express**: A minimal and flexible Node.js web application framework.
- **Prisma**: An open-source ORM for Node.js and TypeScript.
- **Swagger**: Used for API documentation and testing.
- **bcryptjs**: A library to hash passwords.
- **jsonwebtoken**: A library to generate and verify JSON Web Tokens (JWT).

### ORM

- **Prisma**: Used as the ORM to interact with the database, providing a type-safe database client and supporting migrations.

### Database

- **MySQL**: The database provider used in this project, configured via the `DATABASE_URL` environment variable (`Azure service`).

### Models

- **User**: Represents a user in the system.
- **Client**: Represents a client with associated orders.
- **Order**: Represents an order placed by a client.
- **Product**: Represents a product available in the system.
- **Service**: Represents a service offered by the system.

### Routes

The API provides the following routes:

- **Authentication Routes** (`/api/auth`)
  - `POST /register`: Register a new user.
  - `POST /login`: Authenticate a user and return a JWT token.
  - `GET /me`: Validate the JWT token.

- **User Routes** (`/api/users`)
  - `GET /`: Retrieve all users.

- **Client Routes** (`/api/clients`)
  - `GET /`: Retrieve all clients.
  - `POST /`: Create a new client.
  - `GET /{id}`: Retrieve a client by ID.
  - `PUT /{id}`: Update a client.
  - `DELETE /{id}`: Delete a client.

- **Order Routes** (`/api/orders`)
  - `GET /`: Retrieve all orders.
  - `POST /`: Create a new order.
  - `GET /{id}`: Retrieve an order by ID.
  - `PUT /{id}`: Update an order.
  - `DELETE /{id}`: Delete an order.

- **Product Routes** (`/api/products`)
  - `GET /`: Retrieve all products.
  - `POST /`: Create a new product.
  - `GET /{id}`: Retrieve a product by ID.
  - `PUT /{id}`: Update a product.
  - `DELETE /{id}`: Delete a product.

- **Service Routes** (`/api/services`)
  - `GET /`: Retrieve all services.
  - `POST /`: Create a new service.
  - `GET /{id}`: Retrieve a service by ID.
  - `PUT /{id}`: Update a service.
  - `DELETE /{id}`: Delete a service.

**Or access it by `/swagger` or `swagger.json`**

### Configuration

The application is configured using environment variables:

- `DATABASE_URL`: The connection string for the MySQL database.
- `PORT`: The port on which the server runs (default is 3000).
- `API_PREFIX`: The prefix for all API routes (default is `/api`).
- `DEV_MODE`: Enables development mode features like Swagger UI.
- `SALT_ROUNDS`: The number of salt rounds for password hashing (default is 8).

### Running the Application

To run the backend, use:

```bash
npm run dev
```

---

## Frontend: CRM Pro

### Frameworks and Libraries

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

### Features

- **Responsive Design**: Built with Tailwind CSS for a responsive and modern UI.
- **CRUD Operations**: Interfaces for managing clients, orders, products, and services.
- **Authentication**: User login and registration with JWT token management.
- **Dashboard**: Overview of CRM data including recent activities and statistics.

### Configuration

- **API Endpoint**: Configured to communicate with the CRM API backend.

### Running the Application

To run the frontend, use:

```bash
npm run dev
```

## Complete Application Setup

1. **Clone the Repository**:
2. **Install Dependencies**: Run `npm install` in both directories.
3. **Configure Environment Variables**: Set up `.env` files for backend.
4. **Run the Backend**: Start the CRM API server using `npm run dev`.
5. **Run the Frontend**: Start the CRM Pro application using `npm run dev`.
6. **Access the Application**: Open your browser and navigate to the frontend URL (usually `http://localhost:3000`).

## Conclusion

This CRM Application provides a comprehensive solution for managing CRM data with a robust backend API and a modern frontend interface. It is designed to be scalable, secure, and easy to use.

