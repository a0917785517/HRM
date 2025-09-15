export type Employee = {
  id: number;
  employee_no: string;
  name: string;
  title?: string | null;
  email: string;
  department?: string | null;
  hired_at?: string | null;
  status: 'active' | 'inactive';
};
