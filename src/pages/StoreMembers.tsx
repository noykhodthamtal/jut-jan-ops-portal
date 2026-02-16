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
import { useStoreMembers } from '../hooks'

export default function StoreMembers() {
  const {
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
  } = useStoreMembers()

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ສະມາຊິກຮ້ານ
          </Typography>
          <Typography variant="h5">ບຸກຄົນ & ບົດບາດ</Typography>
          <Typography color="text.secondary">
            ເຊີນສະມາຊິກ ປ່ຽນບົດບາດ ແລະຈັດການສະຖານະ
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'ປິດ' : 'ເຊີນຜູ້ໃຊ້'}
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
                label="User ID"
                value={formState.user_id}
                onChange={(event) => setFormState({ ...formState, user_id: event.target.value })}
                placeholder="UUID ຜູ້ໃຊ້"
                sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(45% - 6px)' } }}
              />
              <TextField
                select
                label="ບົດບາດ"
                value={formState.role}
                onChange={(event) => setFormState({ ...formState, role: event.target.value })}
                sx={{ minWidth: 180, flex: { xs: '1 1 100%', md: '1 1 200px' } }}
              >
                <MenuItem value="OWNER">OWNER</MenuItem>
                <MenuItem value="MANAGER">MANAGER</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
              </TextField>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flex: { xs: '1 1 100%', md: '1 1 180px' },
                }}
              >
                <Switch
                  checked={formState.status === 'ເປີດໃຊ້ງານ'}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      status: event.target.checked ? 'ເປີດໃຊ້ງານ' : 'ຖືກລະງັບ',
                    })
                  }
                />
                <Typography variant="body2">{formState.status}</Typography>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' } }}>
                <Button variant="contained" onClick={handleCreate} disabled={loading}>
                  ບັນທຶກ
                </Button>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              ເຊີນສະມາຊິກໃໝ່ແລະກໍານົດບົດບາດໄດ້ໃນຟອມນີ້
            </Typography>
          </Stack>
        </Card>
      ) : null}

      <DataTable
        columns={[
          { key: 'user_id', label: 'ຜູ້ໃຊ້' },
          {
            key: 'role',
            label: 'ບົດບາດ',
            render: (row) => (
              <TextField
                select
                value={row.role}
                onChange={(event) => handleRole(row, event.target.value)}
                size="small"
              >
                <MenuItem value="OWNER">OWNER</MenuItem>
                <MenuItem value="MANAGER">MANAGER</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
              </TextField>
            ),
          },
          {
            key: 'status',
            label: 'ສະຖານະ',
            render: (row) => (
              <Chip
                size="small"
                color={row.status === 'ເປີດໃຊ້ງານ' ? 'primary' : 'default'}
                label={row.status}
              />
            ),
          },
          {
            key: 'actions',
            label: 'ດໍາເນີນການ',
            render: (row) => (
              <Button
                variant="text"
                onClick={() =>
                  handleStatus(
                    row,
                    row.status === 'ເປີດໃຊ້ງານ' ? 'ຖືກລະງັບ' : 'ເປີດໃຊ້ງານ'
                  )
                }
              >
                {row.status === 'ເປີດໃຊ້ງານ' ? 'ລະງັບ' : 'ເປີດ'}
              </Button>
            ),
          },
        ]}
        rows={rows}
        getRowId={(row) => row.id}
        loading={loading}
      />

      {error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}
    </Stack>
  )
}
