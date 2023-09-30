export interface Attendant {
  id: string;
  name: string;
  mobile: number;
  checked: boolean;
  activities: Activities;
}

export type Activities = Record<string, number>;
