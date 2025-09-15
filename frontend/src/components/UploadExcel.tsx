import React, { useRef, useState } from 'react'

type Props = {
  onUpload: (file: File) => Promise<void> | void
}
export default function UploadExcel({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setName(file.name)
    await onUpload(file)
    if (inputRef.current) inputRef.current.value = ''
    setName('')
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={inputRef} type="file" accept=".xls,.xlsx" onChange={handleChange} className="block" />
      {name && <span className="text-sm text-gray-600">{name}</span>}
    </div>
  )
}
