import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { DataTable } from '../../components'

const stores = [
  { name: 'JutJan Central', timezone: 'Asia/Bangkok', status: 'ເປີດໃຊ້ງານ', members: 18 },
  { name: 'JutJan Sukhumvit', timezone: 'Asia/Bangkok', status: 'ເປີດໃຊ້ງານ', members: 9 },
  { name: 'JutJan Chiangmai', timezone: 'Asia/Bangkok', status: 'ປິດໃຊ້ງານ', members: 4 },
]

export default function Stores() {
  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ເຈົ້າຂອງລະບົບ
          </Typography>
          <Typography variant="h5">ຈັດການສາຂາ</Typography>
        </Box>
        <Button variant="contained">ສ້າງສາຂາ</Button>
      </Box>

      <DataTable
        columns={[
          { key: 'name', label: 'ສາຂາ' },
          { key: 'timezone', label: 'ເຂດເວລາ' },
          { key: 'members', label: 'ສະມາຊິກ' },
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
            render: () => <Button variant="text">ເປີດ</Button>,
          },
        ]}
        rows={stores}
        getRowId={(row) => row.name}
      />
    </Stack>
  )
}
