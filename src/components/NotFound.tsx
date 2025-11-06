import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack flexGrow={1} justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h4" component="h1" textAlign="center">
        {t("notFound.title")}
      </Typography>
      <Button
        onClick={() => {
          navigate("/");
        }}
        variant="filled"
      >
        {t("notFound.backHome")}
      </Button>
    </Stack>
  );
}
