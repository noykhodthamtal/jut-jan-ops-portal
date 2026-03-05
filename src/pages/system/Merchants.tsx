import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { DataTable } from '../../components'

const merchants = [
  { name: 'JutJan Foods', plan: 'ໂປ', stores: 12, active: true },
  { name: 'Street Bites', plan: 'ຟຣີ', stores: 3, active: true },
  { name: 'Night Market Co.', plan: 'ໂປ', stores: 6, active: false },
]

export default function Merchants() {
  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ເຈົ້າຂອງລະບົບ
          </Typography>
          <Typography variant="h5">ຈັດການຮ້ານຄ້າ</Typography>
        </Box>
        <Button variant="contained">ສ້າງຮ້ານຄ້າ</Button>
      </Box>

      <DataTable
        columns={[
          { key: 'name', label: 'ຊື່' },
          { key: 'plan', label: 'ແຜນໃຊ້ງານ' },
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
