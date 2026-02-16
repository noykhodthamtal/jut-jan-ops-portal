import {
  Alert,
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";

type LoginFormValues = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email("ອີເມວບໍ່ຖືກຕ້ອງ").required("ກະລຸນາໃສ່ອີເມວ"),
  password: yup.string().required("ກະລຸນາໃສ່ລະຫັດຜ່ານ"),
});

export default function Login() {
  const { login, loading, error } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (shouldRedirect) {
      globalThis.location.hash = "/dashboard";
    }
  }, [shouldRedirect]);

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    setShouldRedirect(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "min(860px, 100%)",
          borderRadius: 0,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(214, 40, 40, 0.18)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              background:
                "linear-gradient(160deg, #fff5f5 0%, #ffe3e3 55%, #ffd2d2 100%)",
              borderRight: { md: "1px solid rgba(214, 40, 40, 0.12)" },
            }}
          >
            <Stack spacing={2.5}>
              <Typography variant="overline" color="text.secondary">
                Jutjan OPS
              </Typography>
              <Typography variant="h4">
                ຈັດລະບຽບວຽກງານຮ້ານ
                <br />
                ໃຫ້ເປັນລະບົບ
              </Typography>
              <Typography color="text.secondary">
                ເຂົ້າສູ່ລະບົບເພື່ອຄວບຄຸມສະຕັອກ, ເອກະສານ, ແລະສະຫຼຸບການເງິນແບບຮວມ.
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{ p: { xs: 3, md: 4 }, display: "grid", alignItems: "center" }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  ເຂົ້າໃຊ້ງານ
                </Typography>
                <Typography variant="h5">ເຂົ້າສູ່ລະບົບ</Typography>
                <Typography color="text.secondary">
                  ກະລຸນາໃສ່ອີເມວ ແລະ ລະຫັດຜ່ານ
                </Typography>
              </Box>
              {error ? <Alert severity="error">ຜິດພາດ: {error}</Alert> : null}
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                display="grid"
                gap={2}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ອີເມວ"
                      type="email"
                      fullWidth
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ລະຫັດຜ່ານ"
                      type="password"
                      fullWidth
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? "ກໍາລັງເຂົ້າລະບົບ..." : "ເຂົ້າລະບົບ"}
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                ມີບັນຫາ? ກະລຸນາຕິດຕໍ່ຜູ້ຈັດການລະບົບ
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
