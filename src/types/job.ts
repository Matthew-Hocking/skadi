export type JobItem = {
  id: string;
  title: string;
  company: string;
  location?: string;
  link?: string;
  notes?: string;
  status_id: string;
  sort_order: number;
  created_at: string;
};

export type JobStatus = {
  id: string;
  title: string;
  order: number;
  created_at: string;
};

export type JobList = {
  id: string;
  title: string;
  created_at: string;
};
