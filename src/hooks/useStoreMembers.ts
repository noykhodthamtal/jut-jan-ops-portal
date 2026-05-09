import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys, getErrorMessage } from '../lib/reactQuery'
import { createStoreMember, fetchStoreMembers, updateStoreMember } from '../services'
import type { StoreMember } from '../models'
import { useCurrentStoreId } from './useCurrentStoreId'

const fallbackMembers: StoreMember[] = [
  { id: '1', store_id: '', user_id: 'u1', role: 'OWNER', status: 'ເປີດໃຊ້ງານ' },
  { id: '2', store_id: '', user_id: 'u2', role: 'MANAGER', status: 'ເປີດໃຊ້ງານ' },
  { id: '3', store_id: '', user_id: 'u3', role: 'STAFF', status: 'ຖືກລະງັບ' },
]

export function useStoreMembers() {
  const storeId = useCurrentStoreId()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    user_id: '',
    role: 'STAFF',
    status: 'ເປີດໃຊ້ງານ',
  })

  const membersQuery = useQuery({
    queryKey: queryKeys.storeMembers(storeId),
    queryFn: () => fetchStoreMembers(storeId),
    enabled: Boolean(storeId),
  })

  const createMutation = useMutation({
    mutationFn: createStoreMember,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, string> }) =>
      updateStoreMember(id, payload),
  })

  const rows = useMemo(() => {
    const members = membersQuery.data ?? []
    return members.length ? members : fallbackMembers
  }, [membersQuery.data])

  const refreshMembers = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.storeMembers(storeId) })
  }

  const handleCreate = async () => {
    if (!storeId) {
      setLocalError('ບໍ່ພົບລະຫັດຮ້ານ')
      return
    }

    try {
      await createMutation.mutateAsync({
        store_id: storeId,
        user_id: formState.user_id,
        role: formState.role,
        status: formState.status,
      })
      await refreshMembers()
      setShowForm(false)
      setFormState({ user_id: '', role: 'STAFF', status: 'ເປີດໃຊ້ງານ' })
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleStatus = async (member: StoreMember, status: string) => {
    try {
      await updateMutation.mutateAsync({ id: member.id, payload: { status } })
      await refreshMembers()
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  const handleRole = async (member: StoreMember, role: string) => {
    try {
      await updateMutation.mutateAsync({ id: member.id, payload: { role } })
      await refreshMembers()
      setLocalError(null)
    } catch (err) {
      setLocalError(getErrorMessage(err))
    }
  }

  return {
    rows,
    loading:
      membersQuery.isLoading ||
      membersQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending,
    error: localError ?? getErrorMessage(membersQuery.error ?? createMutation.error ?? updateMutation.error),
    showForm,
    setShowForm,
    formState,
    setFormState,
    handleCreate,
    handleStatus,
    handleRole,
  }
}
