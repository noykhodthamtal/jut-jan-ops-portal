import { useState } from 'react'
import { Box, Button, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { DataTable } from '../components'
import { usePurchaseOrderRules } from '../hooks'

export default function PurchaseOrderRules() {
  const {
    rules,
    groups,
    groupMap,
    loading,
    error,
    showForm,
    formState,
    setShowForm,
    setFormState,
    handleCreate,
    handleUpdate,
    handleSoftDelete,
  } = usePurchaseOrderRules()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState({ group_id: '', threshold_percent: 10 })

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ຂໍ້ມູນພື້ນຖານ
          </Typography>
          <Typography variant="h5">ກົດກາ PO</Typography>
          <Typography color="text.secondary">
            ກໍານົດ % threshold ຕໍ່ກຸ່ມສໍາລັບແນະນໍາການສັ່ງຊື້
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'ປິດ' : 'ເພີ່ມ Threshold'}
        </Button>
      </Box>

      {showForm ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <TextField
            select
            label="ກຸ່ມ"
            value={formState.group_id}
            onChange={(event) => setFormState({ ...formState, group_id: event.target.value })}
            sx={{ minWidth: 200, flex: { xs: '1 1 100%', sm: '0 0 220px' } }}
          >
            <MenuItem value="">ເລືອກກຸ່ມ</MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.code} · {group.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Threshold (%)"
            type="number"
            value={formState.threshold_percent}
            onChange={(event) =>
              setFormState({ ...formState, threshold_percent: Number(event.target.value || 0) })
            }
            sx={{ minWidth: 180, flex: { xs: '1 1 100%', sm: '0 0 200px' } }}
          />
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            ບັນທຶກ
          </Button>
        </Box>
      ) : null}

      <DataTable
        columns={[
          {
            key: 'group',
            label: 'ກຸ່ມ',
            render: (row) => {
              const group = groupMap.get(row.group_id)
              if (editingId === row.id) {
                return (
                  <TextField
                    select
                    size="small"
                    value={editState.group_id}
                    onChange={(event) =>
                      setEditState({ ...editState, group_id: event.target.value })
                    }
                    sx={{ minWidth: 180 }}
                  >
                    {groups.map((groupRow) => (
                      <MenuItem key={groupRow.id} value={groupRow.id}>
                        {groupRow.code} · {groupRow.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              }
              return group ? `${group.code} · ${group.name}` : row.group_id
            },
          },
          {
            key: 'threshold_percent',
            label: 'Threshold (%)',
            render: (row) =>
              editingId === row.id ? (
                <TextField
                  size="small"
                  type="number"
                  value={editState.threshold_percent}
                  onChange={(event) =>
                    setEditState({
                      ...editState,
                      threshold_percent: Number(event.target.value || 0),
                    })
                  }
                  sx={{ maxWidth: 140 }}
                />
              ) : (
                `${row.threshold_percent}%`
              ),
          },
          {
            key: 'status',
            label: 'ສະຖານະ',
            render: (row) => (
              <Chip size="small" color="primary" label="ເປີດໃຊ້ງານ" />
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
                            group_id: editState.group_id || row.group_id,
                            threshold_percent: editState.threshold_percent,
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
                            group_id: row.group_id,
                            threshold_percent: row.threshold_percent,
                          })
                        }}
                      >
                        ແກ້ໄຂ
                      </Button>
                      <Button variant="text" color="error" onClick={() => handleSoftDelete(row)}>
                        ລຶບ
                      </Button>
                    </>
                  )}
                </Stack>
              )
            },
          },
        ]}
        rows={rules}
        getRowId={(row) => row.id}
        loading={loading}
      />

      {error ? (
        <Typography color="error" sx={{ mt: 1 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}
    </Stack>
  )
}
