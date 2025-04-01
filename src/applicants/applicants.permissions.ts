import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { Roles } from '../app.roles';
import { Job } from '../jobs/job.entity';
import { Recruiter } from '../recruiters/recruiter.entity';
import { Applicant } from './applicant.entity';

export type Subjects =
  | InferSubjects<typeof Applicant | typeof Recruiter | typeof Job>
  | 'all';

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone: ({ can }) => {
    can(Actions.read, Job);
  },
  Applicant({ user, can }) {
    can(Actions.manage, Applicant, { id: user.id });
  },
};
