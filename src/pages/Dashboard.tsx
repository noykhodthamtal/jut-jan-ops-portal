import {
  Box,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import OutputIcon from "@mui/icons-material/Output";
import SavingsIcon from "@mui/icons-material/Savings";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDailySummary, useDocuments } from "../hooks";

const fallbackSummaryCards = [
  { icon: <AccountBalanceWalletIcon />, bg: "#ECFDF5", iconColor: "#10B981" },
  { icon: <OutputIcon />, bg: "#FEF2F2", iconColor: "#EF4444" },
  { icon: <SavingsIcon />, bg: "#EEF2FF", iconColor: "#6366F1" },
];

export default function Dashboard() {
  const { loading: dailyLoading, error: dailyError, summaryCards } = useDailySummary();
  const today = new Date().toISOString().slice(0, 10);
  const { rows: todayDocs, loading: docsLoading, error: docsError } = useDocuments({ fromDate: today, toDate: today });
  
  const loading = dailyLoading || docsLoading;
  const error = dailyError || docsError;

  const cards = summaryCards
    ? summaryCards.map((card, idx) => ({
        ...card,
        icon: fallbackSummaryCards[idx]?.icon ?? <AccountBalanceWalletIcon />,
        bg: fallbackSummaryCards[idx]?.bg ?? "#ECFDF5",
        iconColor: fallbackSummaryCards[idx]?.iconColor ?? "#10B981",
      }))
    : [];

  const docStatus = [
    { label: "ຮັບສະຕັອກ", group: "ທັງໝົດ", value: `${todayDocs.filter(d => d.type === 'STOCK_RECEIPT').length} ລາຍການ`, bg: "#EEF2FF", color: "#6366F1", icon: <ReceiptLongIcon fontSize="small" /> },
    { label: "ນັບສະຕັອກປະຈໍາວັນ", group: "ທັງໝົດ", value: `${todayDocs.filter(d => d.type === 'DAILY_STOCK_COUNT').length} ລາຍການ`, bg: "#FDF4FF", color: "#C026D3", icon: <Inventory2Icon fontSize="small" /> },
    { label: "ໃບສັ່ງຊື້", group: "ທັງໝົດ", value: `${todayDocs.filter(d => d.type === 'PURCHASE_ORDER').length} ລາຍການ`, bg: "#FFFBEB", color: "#D97706", icon: <ShoppingCartCheckoutIcon fontSize="small" /> },
  ];

  const typeMapping: Record<string, string> = {
    STOCK_RECEIPT: "ຮັບສະຕັອກ",
    DAILY_STOCK_COUNT: "ນັບສະຕັອກ",
    PURCHASE_ORDER: "ໃບສັ່ງຊື້"
  };

  const drafts = todayDocs.filter(d => d.status === 'DRAFT' || d.status === 'LOCKED');
  const alerts = drafts.length ? drafts.map(d => ({
    text: `ເອກະສານ ${typeMapping[d.type] || d.type} ກຸ່ມ ${d.group || '—'} ຍັງບໍ່ຢືນຢັນ`,
    time: "ມື້ນີ້",
  })) : [{ text: "ບໍ່ມີແຈ້ງເຕືອນໃໝ່ (ທຸກຢ່າງຮຽบร้อย)", time: "ມື້ນີ້" }];

  return (
    <Stack spacing={4}>
      <Box className="page-header" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: "#111827" }}>ພາບລວມລະບົບ</Typography>
          <Typography color="text.secondary" variant="body2">
            ສະຫຼຸບມື້ນີ້ ພ້ອມສະຖານະເອກະສານ ແລະສັນຍານແຈ້ງເຕືອນ
          </Typography>
        </Box>
        <Chip
          color="default"
          variant="filled"
          label={loading ? "ກໍາລັງໂຫລດ..." : "ມື້ນີ້ · ບັງກອກ (GMT+7)"}
          sx={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", color: "#475569", fontWeight: 600 }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {cards.map((card) => {
          const isNegative = card.delta.startsWith("-");
          const trendColor = isNegative ? "error.main" : "success.main";
          return (
            <Box
              key={card.label}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 12px)",
                  lg: "1 1 calc(33.333% - 16px)",
                },
                minWidth: 0,
              }}
            >
              <Card
                sx={{
                  p: 3,
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: card.bg, color: card.iconColor, width: 48, height: 48, borderRadius: 3 }}>
                    {card.icon}
                  </Avatar>
                  <Chip 
                    label={card.delta} 
                    size="small" 
                    icon={isNegative ? <TrendingDownIcon /> : <TrendingUpIcon />} 
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: isNegative ? "#FEF2F2" : "#ECFDF5", 
                      color: trendColor, 
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: trendColor } 
                    }} 
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                  {card.value}
                </Typography>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(60% - 12px)" }, minWidth: 0 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ color: "#111827", fontWeight: 700 }}>ສະຖານະເອກະສານ</Typography>
                <Typography variant="body2" color="text.secondary">
                  ກວດສອບຄວາມຄືບໜ້າຂອງເອກະສານຕາມກຸ່ມ
                </Typography>
              </Box>
              <IconButton size="small" sx={{ color: "#64748B" }}><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
            </Stack>
            <Stack spacing={2} sx={{ mt: 3 }}>
              {docStatus.map((doc, idx) => (
                <Box key={doc.label}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: doc.bg, color: doc.color, borderRadius: 2 }}>
                      {doc.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: "#1E293B", fontWeight: 600 }}>{doc.label}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        ກຸ່ມ {doc.group}
                      </Typography>
                    </Box>
                    <Chip label={doc.value} size="small" sx={{ fontWeight: 600, bgcolor: "#F1F5F9", color: "#475569" }} />
                  </Box>
                  {idx < docStatus.length - 1 && <Divider sx={{ my: 2, borderStyle: "dashed" }} />}
                </Box>
              ))}
            </Stack>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(40% - 12px)" }, minWidth: 0 }}>
          <Card sx={{ p: 3, height: "100%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.05, transform: "rotate(15deg)" }}>
              <NotificationsActiveIcon sx={{ fontSize: 160 }} />
            </Box>
            <Typography variant="h6" sx={{ color: "#111827", fontWeight: 700 }}>ແຈ້ງເຕືອນວັນນີ້</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              ສິ່ງທີ່ຕ້ອງຈັດການກ່ອນປິດຮ້ານ
            </Typography>
            
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              {alerts.map((alert, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #FFE0E0",
                    backgroundColor: "#FFF5F5",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: "50%", bgcolor: "#EF4444" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#991B1B", mb: 0.5 }}>{alert.text}</Typography>
                      <Typography variant="caption" sx={{ color: "#DC2626", opacity: 0.8 }}>{alert.time}</Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Card>
        </Box>
      </Box>

      {error ? (
        <Typography color="error" sx={{ mt: 2, p: 2, bgcolor: "#FEF2F2", borderRadius: 2 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
