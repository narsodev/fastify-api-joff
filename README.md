# Fastify API

This project is a **Node.js** application developed with **TypeScript**, **Fastify**, **Prisma**, and organized as a **monorepo** using **Lerna**.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Monorepo Setup](#monorepo-setup)
3. [Server Setup](#server-setup)
4. [Database Integration](#database-integration)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [File Upload](#file-upload)
7. [Testing and Documentation](#testing-and-documentation)

## Setup Instructions

First, set up your **.env** file in the **apps/server** folder; using **apps/server/.env.example** as **template**

```bash
# Install dependencies
npm install

# Run db migrations
npm run db:deploy
```

## Monorepo Setup

For improved code organization and maintainability, this project is set up as a monorepo using Lerna. The **structure** is **well-organized** with separate **packages** for different concerns such as **crypto** and **exceptions**.

## Server Setup

The server is separated into **modules** for each concern such as **auth**, **users**, and **posts**. Each module has its **own** **routes**, **controllers** and **services**.

### Service and Repository Pattern

My approach uses a **service** **layer** to **separate** **business** **logic** from the controllers. This makes the code more maintainable and testable.
This service layer uses the **repository pattern** to separate the business logic from the database layer. This repository pattern has been implemented by **Dependency Injection**.

Dependency Injection give us the **possibility to change easily the implementation** of a service without changing the code that uses it. **This is** very **useful** for testing purposes, or if we want to change our database engine, ORM or Cloud Storage Service, for example.

You may think the project will die before we need these changes, but some exceptional requirement may require some of these changes. A larger amount of users, can make us want to change our ORM Prisma. I love Prisma, but it has some caveats.

For example, under the hood, it **does not make** **any** **JOIN** SQL Statements. Instead, it makes multiple queries to the database and map the data using some Rust Engines. This is not a problem for small projects, but it can be if the project grows. More details [here](https://www.youtube.com/watch?v=J2j1XwZRi30).

## Database Integration

We are using **Prisma as ORM**, and **PostgreSQL as database engine**. All the database configuration is in the **apps/server/prisma** folder. We are using **Prisma Migrate** to manage the database migrations. You can find the **migrations in** the **apps/server/prisma/migrations** folder.

## Authentication and Authorization

User Authentication is implemented using **JWT**. The user can **log in** using his **email and password**, and he will receive a JWT Token. This **token will be used to authenticate** the user in the API via **Bearer Authentication**.

Some **routes** are **protected**, and the user will need to **send** the **JWT** Token in the Authorization Header to access them. The user is validated using a [Fastify Hook](https://fastify.dev/docs/latest/Reference/Hooks/).

**Roles** has been implemented. Some endpoints will **require** the user to have a specific **role** to access them, or to **be the owner** of the resource. For example, the user can only update his own profile, or delete his own profile picture.
Users with admin role can access all the endpoints.

## File Upload

The user can upload a profile picture. The picture is stored in a Cloud Storage Service, in this case, **AWS S3**. The user can also delete his profile picture.

GET, PUT and DELETE endpoints are implemented for these purposes.

## Testing and Documentation

The project is tested using [Vitest](https://vitest.dev/). You can run the tests using the following command:

```bash
npm run test
```

The project is documented using [Swagger](https://swagger.io/). You can access the documentation in the following URL:

```bash
<server-url>/api/docs
```
