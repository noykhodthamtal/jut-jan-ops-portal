import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

type Column<Row> = {
  key: string;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (row: Row) => React.ReactNode;
};

type DataTableProps<Row> = {
  columns: Column<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string | number;
  loading?: boolean;
  emptyLabel?: string;
  pageSizeOptions?: number[];
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
};

export default function DataTable<Row>({
  columns,
  rows,
  getRowId,
  loading = false,
  emptyLabel = "ບໍ່ພົບຂໍ້ມູນ",
  pageSizeOptions = [5, 10, 20],
  searchValue,
  onSearch,
  searchPlaceholder = "ຄົ້ນຫາ...",
  toolbar,
}: DataTableProps<Row>) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [internalSearch, setInternalSearch] = useState("");
  const effectiveSearch = searchValue ?? internalSearch;

  const pagedRows = useMemo(() => {
    const start = page * pageSize;
    return rows.slice(start, start + pageSize);
  }, [page, pageSize, rows]);

  const handleSearchChange = (value: string) => {
    if (!onSearch) return;
    if (searchValue === undefined) {
      setInternalSearch(value);
    }
    onSearch(value);
    setPage(0);
  };

  return (
    <Card sx={{ p: 0.5 }}>
      <Stack spacing={1.5} sx={{ p: 2, pb: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {onSearch ? (
            <TextField
              value={effectiveSearch}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              size="small"
              sx={{
                minWidth: 280,
                width: { xs: "100%", sm: 320, md: 360 },
              }}
            />
          ) : null}
          {toolbar ? <Box sx={{ marginLeft: "auto" }}>{toolbar}</Box> : null}
        </Box>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align} sx={{ width: col.width }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography variant="body2">ກໍາລັງໂຫລດ...</Typography>
              </TableCell>
            </TableRow>
          ) : null}
          {!loading && pagedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography variant="body2" color="text.secondary">
                  {emptyLabel}
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}
          {!loading
            ? pagedRows.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render
                        ? col.render(row)
                        : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        rowsPerPageOptions={pageSizeOptions}
        count={rows.length}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(event) => {
          const next = Number(event.target.value);
          setPageSize(next);
          setPage(0);
        }}
        labelRowsPerPage="ຕໍ່ໜ້າ"
      />
    </Card>
  );
}
