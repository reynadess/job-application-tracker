CREATE TABLE public.applications (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "jobId" BIGINT NOT NULL,
    "appliedDate" timestamp with time zone,
    "status" TEXT NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);