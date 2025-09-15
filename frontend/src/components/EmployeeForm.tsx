import React, { useState, useEffect } from 'react'
import type { Employee } from '../types'

type Props = {
  initial?: Partial<Employee>
  onCancel: () => void
  onSubmit: (payload: Omit<Employee,'id'>) => Promise<void> | void
}

const empty: Omit<Employee,'id'> = {
  employee_no: '',
  name: '',
  email: '',
  title: '',
  department: '',
  hired_at: '',
  status: 'active'
}

export default function EmployeeForm({ initial, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Employee,'id'>>(empty)
  useEffect(() => {
    setForm({ ...empty, ...initial } as Omit<Employee,'id'>)
  }, [initial])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="employee_no" value={form.employee_no} onChange={handleChange} placeholder="Employee No" className="border rounded px-3 py-2" required />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border rounded px-3 py-2" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="border rounded px-3 py-2" required />
        <input name="title" value={form.title || ''} onChange={handleChange} placeholder="Title" className="border rounded px-3 py-2" />
        <input name="department" value={form.department || ''} onChange={handleChange} placeholder="Department" className="border rounded px-3 py-2" />
        <input name="hired_at" value={form.hired_at || ''} onChange={handleChange} placeholder="Hired At (YYYY-MM-DD)" className="border rounded px-3 py-2" />
        <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2">
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
        <button type="button" className="px-4 py-2 rounded border" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
