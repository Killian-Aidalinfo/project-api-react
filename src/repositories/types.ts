export interface TeamMember {
  id: number;
  nom: string;
  role: string;
  initiales: string;
}

export interface Service {
  id: number;
  no: string;
  title: string;
  text: string;
}

export interface Project {
  id: number;
  tag: string;
  title: string;
  text: string;
}

export interface FaqItem {
  id: number;
  q: string;
  a: string;
}

export interface ContactMessage {
  id: number;
  nom: string;
  email: string;
  message: string;
  created_at: string;
}

export interface NewContact {
  nom: string;
  email: string;
  message: string;
}

export interface Repository {
  getTeam(): Promise<TeamMember[]>;
  getServices(): Promise<Service[]>;
  getProjects(): Promise<Project[]>;
  getFaq(): Promise<FaqItem[]>;
  listContacts(): Promise<ContactMessage[]>;
  createContact(input: NewContact): Promise<number>;
}
