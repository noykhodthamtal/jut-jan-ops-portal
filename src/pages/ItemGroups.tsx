import { useState } from 'react'
import { Box, Button, Chip, Stack, TextField, Typography, Snackbar, Alert } from '@mui/material'
import { DataTable } from '../components'
import { useItemGroups } from '../hooks'

export default function ItemGroups() {
  const {
    rows,
    loading,
    error,
    success,
    setSuccess,
    showForm,
    formState,
    query,
    setQuery,
    setFormState,
    setShowForm,
    handleCreate,
    handleToggleActive,
    handleUpdate,
    handleSoftDelete,
  } = useItemGroups()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState({ code: '', name: '', sort_order: 1 })

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ຂໍ້ມູນພື້ນຖານ
          </Typography>
          <Typography variant="h5">ກຸ່ມວັດຖຸດິບ</Typography>
          <Typography color="text.secondary">
            ຈັດການກຸ່ມຂອງວັດຖຸດິບໃນຮ້ານ
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'ປິດ' : 'ສ້າງກຸ່ມໃໝ່'}
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
            label="ລະຫັດກຸ່ມ"
            placeholder="A / B / C"
            value={formState.code}
            onChange={(event) => setFormState({ ...formState, code: event.target.value })}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 160px' } }}
          />
          <TextField
            label="ຊື່ກຸ່ມ"
            placeholder="ກຸ່ມວັດຖຸດິບ"
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 240px' } }}
          />
          <TextField
            label="ລໍາດັບ"
            type="number"
            value={formState.sort_order}
            onChange={(event) =>
              setFormState({ ...formState, sort_order: Number(event.target.value || 0) })
            }
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 160px' } }}
          />
          <TextField
            label="ສີ (ທາງເລືອກ)"
            placeholder="#FF6B6B"
            value={formState.color}
            onChange={(event) => setFormState({ ...formState, color: event.target.value })}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}
          />
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            ບັນທຶກກຸ່ມ
          </Button>
        </Box>
      ) : null}

      <DataTable
        columns={[
          {
            key: 'code',
            label: 'ລະຫັດກຸ່ມ',
            render: (row) =>
              editingId === row.id ? (
                <TextField
                  size="small"
                  value={editState.code}
                  onChange={(event) => setEditState({ ...editState, code: event.target.value })}
                />
              ) : (
                row.code
              ),
          },
          {
            key: 'name',
            label: 'ຊື່ກຸ່ມ',
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
            key: 'sort_order',
            label: 'ລໍາດັບ',
            render: (row) =>
              editingId === row.id ? (
                <TextField
                  size="small"
                  type="number"
                  value={editState.sort_order}
                  onChange={(event) =>
                    setEditState({
                      ...editState,
                      sort_order: Number(event.target.value || 0),
                    })
                  }
                />
              ) : (
                row.sort_order
              ),
          },
          {
            key: 'status',
            label: 'ສະຖານະ',
            render: (row) => (
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
                            code: editState.code,
                            name: editState.name,
                            sort_order: editState.sort_order,
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
                            code: row.code,
                            name: row.name,
                            sort_order: row.sort_order,
                          })
                        }}
                      >
                        ແກ້ໄຂ
                      </Button>
                      <Button variant="text" onClick={() => handleToggleActive(row)}>
                        {row.is_active ? 'ປິດ' : 'ເປີດ'}
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
        rows={rows}
        getRowId={(row) => row.id}
        loading={loading}
        searchValue={query}
        onSearch={setQuery}
      />

      {error ? (
        <Typography color="error" sx={{ mt: 1 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ດໍາເນີນການສໍາເລັດແລ້ວ!
        </Alert>
      </Snackbar>
    </Stack>
  )
}
