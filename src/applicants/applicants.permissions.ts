import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { Roles } from '../app.roles';
import { Application } from '../applications/entities/application.entity';
import { Job } from '../jobs/job.entity';
import { Recruiter } from '../recruiters/recruiter.entity';
import { Applicant } from './applicant.entity';

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
        // Applicant
        can(Actions.manage, Applicant, { id: user.id });

        // Applications
        can(Actions.read, Application, { userId: user.id });
        can(Actions.create, Application);
        can(Actions.update, Application, { userId: user.id });
        can(Actions.delete, Application, { userId: user.id });

        // Jobs
        can(Actions.create, Job);
        can(Actions.read, Job);
        can(Actions.update, Job);
        can(Actions.delete, Job);
    },
};
