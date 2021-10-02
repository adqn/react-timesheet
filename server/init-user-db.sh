#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER coreapi WITH ENCRYPTED PASSWORD 'local-setup-coreapi';
    CREATE DATABASE "timesheet-dev";
    GRANT ALL PRIVILEGES ON DATABASE "timesheet-dev" TO coreapi;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "timesheet-dev" <<-EOSQL
    CREATE EXTENSION "uuid-ossp";

    CREATE TABLE accounts (
        id uuid DEFAULT uuid_generate_v4 (),
        info json NOT NULL,
        PRIMARY KEY (id)
    );

    CREATE TABLE templates (
        id SERIAL NOT NULL PRIMARY KEY,
        template jsonb NOT NULL
    );

    CREATE TABLE projects (
        id SERIAL NOT NULL PRIMARY KEY,
        project jsonb NOT NULL
    );

    CREATE TABLE tasks (
        id SERIAL NOT NULL PRIMARY KEY,
        task jsonb NOT NULL
    );

EOSQL