#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER coreapi WITH ENCRYPTED PASSWORD 'local-setup-coreapi';
    CREATE DATABASE "timesheet-dev";
    GRANT ALL PRIVILEGES ON DATABASE "timesheet-dev" TO coreapi;
EOSQL
