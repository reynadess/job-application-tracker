import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { Applicant } from 'src/applicants/applicant.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Roles } from 'src/auth/auth.roles';
import { Job } from 'src/jobs/job.entity';
import { Recruiter } from 'src/recruiters/recruiter.entity';

export type Subjects =
  | InferSubjects<
      typeof Applicant | typeof Recruiter | typeof Job | typeof Application
    >
  | 'all';

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone: ({ can }) => {
    can(Actions.read, Job);
  },
  Applicant({ user, can }) {
    can(Actions.manage, Applicant, { id: user.id });
    can(Actions.manage, Application, { id: user.id });
  },
};
