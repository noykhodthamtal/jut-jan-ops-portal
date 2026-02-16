import { Box, Card, Stack, Typography } from '@mui/material'

const metrics = [
  { label: 'ຮ້ານຄ້າ (Merchant)', value: 18 },
  { label: 'ສາຂາ', value: 64 },
  { label: 'ສາຂາໃຊ້ງານມື້ນີ້', value: 52 },
  { label: 'ເອກະສານມື້ນີ້', value: 384 },
]

export default function SystemDashboard() {
  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ເຈົ້າຂອງລະບົບ
          </Typography>
          <Typography variant="h5">ສະຖິຕິລະບົບ</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {metrics.map((metric) => (
          <Box
            key={metric.label}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', lg: '1 1 calc(25% - 12px)' },
              minWidth: 0,
            }}
          >
            <Card sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {metric.label}
              </Typography>
              <Typography variant="h4">{metric.value}</Typography>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(55% - 8px)' }, minWidth: 0 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="h6">ເອກະສານປະຈໍາວັນ</Typography>
            <Box sx={{ height: 180, mt: 2, borderRadius: 2, backgroundColor: '#ffe5e5' }} />
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(45% - 8px)' }, minWidth: 0 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="h6">ສຸຂະພາບ & ແຈ້ງເຕືອນ</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              ບໍ່ມີແຈ້ງເຕືອນສໍາຄັນມື້ນີ້
            </Typography>
          </Card>
        </Box>
      </Box>
    </Stack>
  )
}
