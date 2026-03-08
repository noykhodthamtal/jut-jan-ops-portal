import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { DataTable } from '../components'
import { useItems } from '../hooks'

export default function Items() {
  const {
    rows,
    groups,
    loading,
    error,
    showForm,
    formState,
    query,
    setFormState,
    setQuery,
    setShowForm,
    handleCreate,
    handleUpdate,
    handleSoftDelete,
  } = useItems()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState({ name: '', unit: '', group_id: '', is_active: true })

  const groupMap = new Map(groups.map((group) => [group.id, group]))

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ຂໍ້ມູນພື້ນຖານ
          </Typography>
          <Typography variant="h5">ວັດຖຸດິບ</Typography>
          <Typography color="text.secondary">
            ກໍານົດວັດຖຸດິບ ຫົວໜ່ວຍ ແລະກຸ່ມ
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'ປິດ' : 'ສ້າງວັດຖຸດິບ'}
        </Button>
      </Box>

      {showForm ? (
        <Card sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              <TextField
                label="ຊື່"
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 6px)' } }}
              />
              <TextField
                label="ຫົວໜ່ວຍ"
                value={formState.unit}
                onChange={(event) => setFormState({ ...formState, unit: event.target.value })}
                sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 6px)' } }}
              />
              <TextField
                select
                label="ກຸ່ມ"
                value={formState.group_id}
                onChange={(event) => setFormState({ ...formState, group_id: event.target.value })}
                sx={{ minWidth: 140, flex: { xs: '1 1 100%', md: '1 1 160px' } }}
              >
                <MenuItem value="">ເລືອກກຸ່ມ</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.code} · {group.name}
                  </MenuItem>
                ))}
              </TextField>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flex: { xs: '1 1 100%', md: '1 1 200px' },
                }}
              >
                <Switch
                  checked={formState.is_active}
                  onChange={(event) =>
                    setFormState({ ...formState, is_active: event.target.checked })
                  }
                />
                <Typography variant="body2">
                  {formState.is_active ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                </Typography>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' } }}>
                <Button variant="contained" onClick={handleCreate} disabled={loading}>
                  ບັນທຶກ
                </Button>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              ໃສ່ຂໍ້ມູນວັດຖຸດິບໃໝ່ແລ້ວກົດບັນທຶກ
            </Typography>
          </Stack>
        </Card>
      ) : null}

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'ຊື່',
            render: (row) =>
              editingId === row.id ? (
                <TextField
                  size="small"
                  value={editState.name}
                  onChange={(event) => setEditState({ ...editState, name: event.target.value })}
                />
              ) : (
                row.name
              ),
          },
          {
            key: 'unit',
            label: 'ຫົວໜ່ວຍ',
            render: (row) =>
              editingId === row.id ? (
                <TextField
                  size="small"
                  value={editState.unit}
                  onChange={(event) => setEditState({ ...editState, unit: event.target.value })}
                />
              ) : (
                row.unit
              ),
          },
          {
            key: 'group',
            label: 'ກຸ່ມ',
            render: (row) =>
              editingId === row.id ? (
                <TextField
                  select
                  size="small"
                  value={editState.group_id}
                  onChange={(event) => setEditState({ ...editState, group_id: event.target.value })}
                  sx={{ minWidth: 160 }}
                >
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.code} · {group.name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : groupMap.get(row.group_id)
              ? `${groupMap.get(row.group_id)?.code} · ${groupMap.get(row.group_id)?.name}`
              : row.group_id,
          },
          {
            key: 'status',
            label: 'ສະຖານະ',
            render: (row) =>
              editingId === row.id ? (
                <Switch
                  checked={editState.is_active}
                  onChange={(event) =>
                    setEditState({ ...editState, is_active: event.target.checked })
                  }
                />
              ) : (
                <Chip
                  size="small"
                  color={row.is_active ? 'primary' : 'default'}
                  label={row.is_active ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                />
              ),
          },
          {
            key: 'actions',
            label: 'ດໍາເນີນການ',
            render: (row) => {
              const isEditing = editingId === row.id
              return (
                <Stack direction="row" spacing={1}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="text"
                        onClick={() => {
                          handleUpdate(row.id, {
                            name: editState.name,
                            unit: editState.unit,
                            group_id: editState.group_id,
                            is_active: editState.is_active,
                          })
                          setEditingId(null)
                        }}
                        disabled={loading}
                      >
                        ບັນທຶກ
                      </Button>
                      <Button variant="text" onClick={() => setEditingId(null)}>
                        ຍົກເລີກ
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="text"
                        onClick={() => {
                          setEditingId(row.id)
                          setEditState({
                            name: row.name,
                            unit: row.unit,
                            group_id: row.group_id,
                            is_active: row.is_active,
                          })
                        }}
                      >
                        ແກ້ໄຂ
                      </Button>
                      <Button variant="text" color="error" onClick={() => handleSoftDelete(row.id)}>
                        ລຶບ
                      </Button>
                    </>
                  )}
                </Stack>
              )
            },
          },
        ]}
        rows={rows}
        getRowId={(row) => row.id}
        loading={loading}
        searchValue={query}
        onSearch={setQuery}
      />

      {error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}
    </Stack>
  )
}
