-- Setup Airbyte database schema
SELECT 'CREATE DATABASE airbyte'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'airbyte')\gexec

-- Create user for Airbyte if doesn't exist  
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'airbyte_user') THEN
      CREATE ROLE airbyte_user LOGIN PASSWORD 'airbyte_password';
   END IF;
END
$do$;

-- Grant privileges on the airbyte database
GRANT ALL PRIVILEGES ON DATABASE airbyte TO airbyte_user;

-- Airbyte will create its own tables when it starts
-- This just ensures the database exists and permissions are set 