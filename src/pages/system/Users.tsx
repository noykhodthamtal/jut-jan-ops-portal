import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { DataTable } from '../../components'

const users = [
  { name: 'Arthit', merchants: 1, stores: 2, status: 'ເປີດໃຊ້ງານ' },
  { name: 'Kanya', merchants: 1, stores: 1, status: 'ຖືກລະງັບ' },
  { name: 'Niran', merchants: 2, stores: 6, status: 'ເປີດໃຊ້ງານ' },
]

export default function Users() {
  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ເຈົ້າຂອງລະບົບ
          </Typography>
          <Typography variant="h5">ຈັດການຜູ້ໃຊ້ & ສະມາຊິກ</Typography>
        </Box>
      </Box>

      <DataTable
        columns={[
          { key: 'name', label: 'ຜູ້ໃຊ້' },
          { key: 'merchants', label: 'ຮ້ານຄ້າ' },
          { key: 'stores', label: 'ສາຂາ' },
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
            render: () => <Button variant="text">ກວດສອບ</Button>,
          },
        ]}
        rows={users}
        getRowId={(row) => row.name}
      />
    </Stack>
  )
}
