-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE EXTENSION citext;
CREATE DOMAIN domain_email AS citext
CHECK(
   VALUE ~ '^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$'
);
-- for valid samples
SELECT 'some_email@gmail.com'::domain_email;
SELECT 'accountant@dbrnd.org'::domain_email;
-- for an invalid sample
SELECT 'dba@aol.info'::domain_email;

CREATE TABLE public.applicants (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	username text,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" domain_email UNIQUE NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);