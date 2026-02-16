import { useEffect, useMemo, useState } from 'react'
import { createStoreMember, fetchStoreMembers, updateStoreMember } from '../services'
import { getStoreId } from '../lib/supabase'
import type { StoreMember } from '../models'

const fallbackMembers: StoreMember[] = [
  { id: '1', store_id: '', user_id: 'u1', role: 'OWNER', status: 'ເປີດໃຊ້ງານ' },
  { id: '2', store_id: '', user_id: 'u2', role: 'MANAGER', status: 'ເປີດໃຊ້ງານ' },
  { id: '3', store_id: '', user_id: 'u3', role: 'STAFF', status: 'ຖືກລະງັບ' },
]

export function useStoreMembers() {
  const [members, setMembers] = useState<StoreMember[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState({
    user_id: '',
    role: 'STAFF',
    status: 'ເປີດໃຊ້ງານ',
  })

  const loadMembers = () => {
    const storeId = getStoreId()
    if (!storeId) return

    setLoading(true)
    fetchStoreMembers(storeId)
      .then((data) => {
        setMembers(data)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const rows = useMemo(() => (members.length ? members : fallbackMembers), [members])

  const handleCreate = async () => {
    const storeId = getStoreId()
    if (!storeId) {
      setError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }

    setLoading(true)
    try {
      const created = await createStoreMember({
        store_id: storeId,
        user_id: formState.user_id,
        role: formState.role,
        status: formState.status,
      })
      setMembers((prev) => [...created, ...prev])
      setShowForm(false)
      setFormState({ user_id: '', role: 'STAFF', status: 'ເປີດໃຊ້ງານ' })
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (member: StoreMember, status: string) => {
    setLoading(true)
    try {
      const updated = await updateStoreMember(member.id, { status })
      if (updated[0]) {
        setMembers((prev) => prev.map((m) => (m.id === member.id ? updated[0] : m)))
      }
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRole = async (member: StoreMember, role: string) => {
    setLoading(true)
    try {
      const updated = await updateStoreMember(member.id, { role })
      if (updated[0]) {
        setMembers((prev) => prev.map((m) => (m.id === member.id ? updated[0] : m)))
      }
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    rows,
    loading,
    error,
    showForm,
    setShowForm,
    formState,
    setFormState,
    handleCreate,
    handleStatus,
    handleRole,
  }
}
