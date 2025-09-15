import type { Employee } from './types';

const API_BASE = '/api';

export async function listEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}/employees`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function createEmployee(payload: Omit<Employee, 'id'>): Promise<Employee> {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create employee');
  return res.json();
}

export async function updateEmployee(id: number, payload: Partial<Omit<Employee, 'id'>>): Promise<Employee> {
  const res = await fetch(`${API_BASE}/employees/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return res.json();
}

export async function deleteEmployee(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete employee');
}

export async function uploadExcel(file: File): Promise<{inserted: number}> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/employees/upload-excel`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Failed to upload Excel');
  return res.json();
}
