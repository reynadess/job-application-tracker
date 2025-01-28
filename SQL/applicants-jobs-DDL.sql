CREATE TABLE public.applicantsJobs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userId BIGINT NOT NULL,
    jobId BIGINT NOT NULL,
    appliedDate timestamp with time zone,
    "status" TEXT,
    "notes" TEXT,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);