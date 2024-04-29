This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting up the database

This project uses [Prisma](https://www.prisma.io/) to interact with the database. To set up the database, you need to create a `.env.local` file in the root of the project and add the following environment variables:

```bash
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

`TURSO_DATABASE_URL` is the URL to the database. `TURSO_AUTH_TOKEN` is the authentication token for the database.

As this project uses [Turso](https://turso.tech/), you need to set up the turso database. To do this, create an account on Turso and create a new database. Then, add the database URL and the authentication token to the `.env.local` file. You can do this installing the [Turso CLI](https://docs.turso.tech/cli/installation) and running the following commands:

```bash
# Assuming you have already created an account on Turso
turso auth login
turso database create <database-name>

# Copy the database URL and the authentication token
turso db show --url <database-name>
turso db tokens create <database-name>
```

After setting up the environment variables, run the following command to create the prisma client types:

```bash
npx prisma generate
```

Then run the following command to create the database tables:

```bash
npx prisma migrate dev --name <migration-name>
```

Now you need to send the migration to the database on Turso:

```bash
turso db shell <database-name> < ./prisma/migrations/<migration-name>/migration.sql
```

## Setting up the database locally

To run your database locally set up to following evironment variable:

```bash
LOCAL_DB_URL=http://127.0.0.1:8080
```

Then you can run:

```bash
npx prisma migrate dev
turso dev --db-file ./prisma/dev.db
```

Then to access your database you can run:

```bash
npx prisma studio
```

## Issues

[Top level await](https://github.com/prisma/prisma/issues/23600)