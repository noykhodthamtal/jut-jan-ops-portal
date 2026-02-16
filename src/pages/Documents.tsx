import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataTable } from "../components";
import { useDocuments } from "../hooks";

const typeLabels: Record<string, string> = {
  STOCK_RECEIPT: "ຮັບສະຕັອກ",
  DAILY_STOCK_COUNT: "ນັບສະຕັອກປະຈໍາວັນ",
  PURCHASE_ORDER: "ໃບສັ່ງຊື້",
};

export default function Documents() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [group, setGroup] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const { rows, loading, error } = useDocuments({
    fromDate,
    toDate,
    group,
    status,
  });

  const formatted = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        typeLabel: typeLabels[row.type] ?? row.type,
      })),
    [rows],
  );

  return (
    <Stack spacing={2}>
      <Box className="page-header">
        <Box>
          <Typography variant="overline" color="text.secondary">
            ການຄຸ້ມຄອງເອກະສານ
          </Typography>
          <Typography variant="h5">ເອກະສານທັງໝົດ</Typography>
          <Typography color="text.secondary">
            ເບິ່ງເອກະສານຍ້ອນຫຼັງ ພ້ອມຕົວກອງ
          </Typography>
        </Box>
      </Box>

      <Card sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <TextField
              type="date"
              label="ວັນທີເລີ່ມ"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "1 1 180px" } }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="ວັນທີສິ້ນສຸດ"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "1 1 180px" } }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="ກຸ່ມ"
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              sx={{ minWidth: 140, flex: { xs: "1 1 100%", sm: "1 1 140px" } }}
            >
              <MenuItem value="">ທຸກກຸ່ມ</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </TextField>
            <TextField
              select
              label="ສະຖານະ"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              sx={{ minWidth: 160, flex: { xs: "1 1 100%", sm: "1 1 160px" } }}
            >
              <MenuItem value="">ທຸກສະຖານະ</MenuItem>
              <MenuItem value="DRAFT">ຮ່າງ</MenuItem>
              <MenuItem value="LOCKED">ລັອກ</MenuItem>
              <MenuItem value="POSTED">ໂພສຕ໌</MenuItem>
              <MenuItem value="SENT">ສົ່ງແລ້ວ</MenuItem>
            </TextField>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 auto" } }}>
              <Button variant="contained">ສ້າງເອກະສານ</Button>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            ຕົວກອງຈະສະແດງຜົນໃນຕາຕະລາງດ້ານລຸ່ມ
          </Typography>
        </Stack>
      </Card>

      <DataTable
        columns={[
          { key: "id", label: "ເລກເອກະສານ" },
          { key: "typeLabel", label: "ປະເພດ" },
          { key: "group", label: "ກຸ່ມ" },
          {
            key: "status",
            label: "ສະຖານະ",
            render: (row) => (
              <Chip label={row.status} size="small" color="secondary" />
            ),
          },
          {
            key: "owner",
            label: "ເຈົ້າຂອງ",
            render: (row) => row.owner ?? "—",
          },
          {
            key: "actions",
            label: "ດໍາເນີນການ",
            render: () => <Button variant="text">ເປີດ</Button>,
          },
        ]}
        rows={formatted}
        getRowId={(row) => row.id}
        loading={loading}
      />

      {error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Supabase ຜິດພາດ: {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
