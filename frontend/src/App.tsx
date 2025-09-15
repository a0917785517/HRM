import React, { useEffect, useState } from 'react'
import { listEmployees, createEmployee, deleteEmployee, updateEmployee, uploadExcel } from './api'
import type { Employee } from './types'
import EmployeeForm from './components/EmployeeForm'
import UploadExcel from './components/UploadExcel'

export default function App() {
  const [data, setData] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setData(await listEmployees())
      } catch (e:any) {
        setError(e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleCreate(payload: Omit<Employee,'id'>) {
    await createEmployee(payload)
    setShowForm(false)
    setData(await listEmployees())
  }
  async function handleUpdate(payload: Omit<Employee,'id'>) {
    if (!editing) return
    await updateEmployee(editing.id, payload)
    setEditing(null); setShowForm(false)
    setData(await listEmployees())
  }
  async function handleDelete(id: number) {
    await deleteEmployee(id)
    setData(await listEmployees())
  }
  async function handleUpload(file: File) {
    await uploadExcel(file)
    setData(await listEmployees())
  }

  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">HRM — Employees</h1>
        <div className="flex items-center gap-3">
          <UploadExcel onUpload={handleUpload} />
          <button onClick={() => { setEditing(null); setShowForm(true) }} className="bg-black text-white px-4 py-2 rounded">New</button>
        </div>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="mb-6 border rounded p-4 bg-white">
          <h2 className="font-medium mb-3">{editing ? 'Edit Employee' : 'New Employee'}</h2>
          <EmployeeForm
            initial={editing || undefined}
            onCancel={() => { setShowForm(false); setEditing(null) }}
            onSubmit={editing ? handleUpdate : handleCreate}
          />
        </div>
      )}

      <div className="overflow-x-auto bg-white border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Employee No</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={8}>Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td className="px-3 py-3" colSpan={8}>No employees.</td></tr>
            ) : data.map((e, i) => (
              <tr key={e.id} className="border-t">
                <td className="px-3 py-2">{i+1}</td>
                <td className="px-3 py-2">{e.employee_no}</td>
                <td className="px-3 py-2">{e.name}</td>
                <td className="px-3 py-2">{e.title || '-'}</td>
                <td className="px-3 py-2">{e.email}</td>
                <td className="px-3 py-2">{e.department || '-'}</td>
                <td className="px-3 py-2">{e.status}</td>
                <td className="px-3 py-2 text-right">
                  <button className="px-3 py-1 border rounded mr-2" onClick={() => { setEditing(e); setShowForm(true) }}>Edit</button>
                  <button className="px-3 py-1 border rounded" onClick={() => handleDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
