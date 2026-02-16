import {
  Box,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useDailySummary } from "../hooks";

const fallbackSummaryCards = [
  { label: "ລາຍຮັບປະຈໍາວັນ", value: "฿12,450", delta: "+8.4%" },
  { label: "ຄ່າໃຊ້ຈ່າຍປະຈໍາວັນ", value: "฿5,120", delta: "-3.1%" },
  { label: "ກໍາໄລຂັ້ນຕົ້ນ", value: "฿7,330", delta: "+11.2%" },
];

const docStatus = [
  { label: "ຮັບສະຕັອກ", group: "A/B/C", value: "6 ເປີດ" },
  { label: "ນັບສະຕັອກປະຈໍາວັນ", group: "A/B/C", value: "2 ເປີດ" },
  { label: "ໃບສັ່ງຊື້", group: "A/B/C", value: "3 ຄ້າງຢືນຢັນ" },
];

const alerts = [
  "ຍັງບໍ່ປິດສະຕັອກກຸ່ມ B (ມື້ນີ້)",
  "PO ກຸ່ມ A ຍັງບໍ່ສົ່ງ",
  "ຍອດຄ່າໃຊ້ຈ່າຍຍັງບໍ່ຢືນຢັນ",
];

export default function Dashboard() {
  const { loading, error, summaryCards } = useDailySummary();
  const cards = summaryCards ?? fallbackSummaryCards;

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="h5">ພາບລວມວຽກງານຮ້ານ</Typography>
          <Typography color="text.secondary">
            ສະຫຼຸບມື້ນີ້ ພ້ອມສະຖານະເອກະສານ ແລະສັນຍານແຈ້ງເຕືອນ
          </Typography>
        </Box>
        <Chip
          color="primary"
          variant="outlined"
          label={loading ? "ກໍາລັງໂຫລດ..." : "ມື້ນີ້ · ບັງກອກ (GMT+7)"}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {cards.map((card, index) => (
          <Box
            key={card.label}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 8px)",
                lg: "1 1 calc(33.333% - 10px)",
              },
              minWidth: 0,
            }}
          >
            <Card
              sx={{
                p: 2.5,
                borderRadius: 3,
                background:
                  index === 0
                    ? "linear-gradient(135deg, #fff0f0, #ffd9d9)"
                    : index === 1
                    ? "linear-gradient(135deg, #fff5f2, #ffe6db)"
                    : "linear-gradient(135deg, #fff1f1, #ffd7c7)",
                boxShadow: "0 16px 26px rgba(214,40,40,0.08)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                  {card.label}
                </Typography>
                {card.delta.startsWith("-") ? (
                  <TrendingDownIcon fontSize="small" color="error" />
                ) : (
                  <TrendingUpIcon fontSize="small" color="success" />
                )}
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.delta} ຈາກມື້ວານ
              </Typography>
              <LinearProgress
                sx={{ mt: 2, height: 6, borderRadius: 999 }}
                color={card.delta.startsWith("-") ? "error" : "success"}
                variant="determinate"
                value={card.delta.startsWith("-") ? 34 : 68}
              />
            </Card>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(60% - 8px)" }, minWidth: 0 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">ສະຖານະເອກະສານ</Typography>
                <Typography variant="body2" color="text.secondary">
                  ກວດສອບຄວາມຄືບໜ້າຂອງເອກະສານຕາມກຸ່ມ
                </Typography>
              </Box>
              <Chip label="ອັບເດດລ່າສຸດ" color="secondary" variant="outlined" />
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              {docStatus.map((doc) => (
                <Box
                  key={doc.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    background: "rgba(255, 244, 244, 0.75)",
                  }}
                >
                  {doc.label.includes("ຮັບ") ? (
                    <ReceiptLongIcon color="primary" fontSize="small" />
                  ) : doc.label.includes("ນັບ") ? (
                    <Inventory2Icon color="primary" fontSize="small" />
                  ) : (
                    <ShoppingCartCheckoutIcon color="primary" fontSize="small" />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">{doc.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ກຸ່ມ {doc.group}
                    </Typography>
                  </Box>
                  <Chip label={doc.value} color="secondary" />
                </Box>
              ))}
            </Stack>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(40% - 8px)" }, minWidth: 0 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6">ແຈ້ງເຕືອນວັນນີ້</Typography>
            <Typography variant="body2" color="text.secondary">
              ສິ່ງທີ່ຕ້ອງຈັດການກ່ອນປິດຮ້ານ
            </Typography>
            <Stack spacing={1.5} mt={2}>
              {alerts.map((alert) => (
                <Box
                  key={alert}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(214,40,40,0.12)",
                    backgroundColor: "#fff5f5",
                  }}
                >
                  <Typography variant="body2">{alert}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Box>
      </Box>

      {error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
