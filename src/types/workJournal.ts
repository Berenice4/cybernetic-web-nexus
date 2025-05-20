
export interface WorkActivity {
  order: string;
  mode: string;
  activity: string;
}

export interface Workers {
  qualification: string;
  count: number;
}

export interface Equipment {
  name: string;
  description: string;
}

export interface Supply {
  name: string;
  invoice: string;
  details: string;
}

export interface Circumstance {
  description: string;
  weather: string;
  terrain: string;
  notes: string;
}

export interface ServiceOrder {
  orderNumber: string;
  description: string;
  issuedBy: string;
}

export interface Report {
  recipient: string;
  subject: string;
  date: string;
}

export interface VerificationProcess {
  type: string;
  description: string;
}

export interface Dispute {
  type: "contestazione" | "sospensione" | "ripresa";
  description: string;
  date: string;
}

export interface Variant {
  description: string;
  priceChanges: string;
}

export interface WorkJournalEntry {
  id: string;
  date: string;
  activities: WorkActivity[];
  workers: Workers[];
  equipment: Equipment[];
  supplies: Supply[];
  circumstances: Circumstance[];
  serviceOrders: ServiceOrder[];
  reports: Report[];
  verifications: VerificationProcess[];
  disputes: Dispute[];
  variants: Variant[];
}
