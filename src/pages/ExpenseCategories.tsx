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
import { useExpenseCategories } from '../hooks'

export default function ExpenseCategories() {
  const {
    rows,
    loading,
    error,
    showForm,
    setShowForm,
    formState,
    setFormState,
    handleCreate,
    handleToggleActive,
  } = useExpenseCategories()

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ຂໍ້ມູນພື້ນຖານ
          </Typography>
          <Typography variant="h5">ໝວດຄ່າໃຊ້ຈ່າຍ</Typography>
          <Typography color="text.secondary">
            ຈັດການໝວດຄ່າໃຊ້ຈ່າຍຄົງທີ່ ແລະຜັນຜວນ
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'ປິດ' : 'ເພີ່ມໝວດ'}
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
                select
                label="ປະເພດ"
                value={formState.is_fixed ? 'fixed' : 'variable'}
                onChange={(event) =>
                  setFormState({ ...formState, is_fixed: event.target.value === 'fixed' })
                }
                sx={{ minWidth: 160, flex: { xs: '1 1 100%', md: '1 1 200px' } }}
              >
                <MenuItem value="fixed">ຄົງທີ່</MenuItem>
                <MenuItem value="variable">ຜັນຜວນ</MenuItem>
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
              ກໍານົດໝວດຄ່າໃຊ້ຈ່າຍໃໝ່ເພື່ອໃຊ້ໃນລາຍງານ
            </Typography>
          </Stack>
        </Card>
      ) : null}

      <DataTable
        columns={[
          { key: 'name', label: 'ຊື່' },
          {
            key: 'type',
            label: 'ປະເພດ',
            render: (row) => (row.is_fixed ? 'ຄົງທີ່' : 'ຜັນຜວນ'),
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
            render: (row) => (
              <Button variant="text" onClick={() => handleToggleActive(row)}>
                {row.is_active ? 'ປິດ' : 'ເປີດ'}
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
