#!/bin/bash
set -e

echo "Creating databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE user_db;
    CREATE DATABASE product_db;
    CREATE DATABASE order_db;
    CREATE DATABASE payment_db;
EOSQL

echo "Databases created successfully!"
