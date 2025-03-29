CREATE DATABASE "JobApplicationTracker";
GRANT ALL PRIVILEGES ON DATABASE "JobApplicationTracker" TO postgres;

BEGIN;

-- Connect to the database
\connect JobApplicationTracker postgres;

-- Create the jobs table
CREATE TABLE public.jobs (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"role" text NOT NULL,
    "companyId" BIGINT,
	company text NOT NULL,
    ctcOffered numeric,
    "status" text,
    jobLink text,
    city text,
    "state" text,
    "country" text,
	"description" text,
    "recruiterId" text,
    "recruiterEmail" text,
    "recruiterPhone" text,
    "createdBy" text NOT NULL, -- userId of the person who created the job
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the applicants table
CREATE EXTENSION citext;
CREATE DOMAIN domain_email AS citext
CHECK(
   VALUE ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
);

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

-- Create the applicantsJobs table
CREATE TABLE public.applicantsJobs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userId BIGINT NOT NULL,
    jobId BIGINT NOT NULL,
    appliedDate timestamp with time zone,
    "status" TEXT,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);

COMMIT;