-- public.jobs definition

-- Drop table

-- DROP TABLE public.jobs;

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