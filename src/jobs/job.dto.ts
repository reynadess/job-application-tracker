export class JobDTO {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  datePosted: Date;
  status: JobStatus;

  constructor(
    id: string,
    title: string,
    company: string,
    location: string,
    description: string,
    datePosted: Date,
    status: JobStatus,
  ) {
    this.id = id;
    this.title = title;
    this.company = company;
    this.location = location;
    this.description = description;
    this.datePosted = datePosted;
    this.status = status;
  }
}

export enum JobStatus {
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
}
