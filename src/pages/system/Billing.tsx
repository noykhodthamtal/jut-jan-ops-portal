import { Box, Button, Card, Stack, Typography } from '@mui/material'

export default function Billing() {
  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ເຈົ້າຂອງລະບົບ
          </Typography>
          <Typography variant="h5">ການຈ່າຍເງິນ & ສະມາຊິກ</Typography>
          <Typography color="text.secondary">
            ສ່ວນນີ້ຢູ່ໃນແຜນງານຖັດໄປ
          </Typography>
        </Box>
      </Box>

      <Card sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">ຟີຈເຈີທີ່ຈະມາ</Typography>
          <Stack spacing={1}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fff5f5' }}>
              <Typography variant="body2">ແຜນການໃຊ້ງານ & ຂີດຈໍາກັດ</Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fff5f5' }}>
              <Typography variant="body2">ອັບເກຣດ / ດາວນເກຣດ</Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fff5f5' }}>
              <Typography variant="body2">ປະຫວັດການຈ່າຍເງິນ</Typography>
            </Box>
          </Stack>
          <Button variant="contained">ສ້າງວຽກ Roadmap</Button>
        </Stack>
      </Card>
    </Stack>
  )
}
