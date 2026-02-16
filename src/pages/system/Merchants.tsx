import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { DataTable } from '../../components'

const merchants = [
  { name: 'JutJan Foods', plan: 'PRO', stores: 12, active: true },
  { name: 'Street Bites', plan: 'FREE', stores: 3, active: true },
  { name: 'Night Market Co.', plan: 'PRO', stores: 6, active: false },
]

export default function Merchants() {
  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ເຈົ້າຂອງລະບົບ
          </Typography>
          <Typography variant="h5">ຈັດການ Merchant</Typography>
        </Box>
        <Button variant="contained">ສ້າງ Merchant</Button>
      </Box>

      <DataTable
        columns={[
          { key: 'name', label: 'ຊື່' },
          { key: 'plan', label: 'ແຜນ' },
          { key: 'stores', label: 'ສາຂາ' },
          {
            key: 'status',
            label: 'ສະຖານະ',
            render: (row) => (
              <Chip
                size="small"
                color={row.active ? 'primary' : 'default'}
                label={row.active ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
              />
            ),
          },
          {
            key: 'actions',
            label: 'ດໍາເນີນການ',
            render: () => <Button variant="text">ຈັດການ</Button>,
          },
        ]}
        rows={merchants}
        getRowId={(row) => row.name}
      />
    </Stack>
  )
}
