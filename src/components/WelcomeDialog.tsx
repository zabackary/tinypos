import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getLogs } from "../store/log";

export default function WelcomeDialog({
  headerIsHelp = false,
  open,
  onClose,
}: {
  headerIsHelp?: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {headerIsHelp ? t("welcome.helpTitle") : t("welcome.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("welcome.p1")} {t("welcome.p1b")}{" "}
          <Link
            href="https://github.com/zabackary/tinypos/issues/new"
            target="_blank"
          >
            {t("welcome.reportIssueLinkText")}
          </Link>
          。
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>{t("welcome.p2")}</DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          {t("welcome.p3")}{" "}
          <Link
            href="https://web.dev/learn/pwa/installation?hl=ja#ios_and_ipados_installation:~:text=%E3%83%9B%E3%83%BC%E3%83%A0%E7%94%BB%E9%9D%A2%E3%81%AB%E3%82%A2%E3%83%97%E3%83%AA,%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82"
            target="_blank"
          >
            {t("welcome.p3LinkText")}
          </Link>{" "}
          {"をご覧ください。"}
        </DialogContentText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            borderRadius: 3,
            p: 1,
            mt: 2,
            bgcolor: (theme) => theme.palette.surfaceContainerHighest.main,
          }}
        >
          {t("welcome.thanks")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            borderRadius: 3,
            p: 1,
            mt: 2,
            bgcolor: (theme) => theme.palette.surfaceContainerHighest.main,
          }}
        >
          {t("welcome.bible1")}
          <br />
          {t("welcome.bible2")}
        </Typography>
      </DialogContent>
      <DialogActions>
        {headerIsHelp ? (
          <Button
            variant="tonal"
            onClick={() => {
              getLogs().then((logs) => {
                const blob = new Blob([JSON.stringify(logs)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "tiny-pos-logs.json";
                a.click();
                URL.revokeObjectURL(url);
              });
            }}
          >
            {t("welcome.downloadLogs")}
          </Button>
        ) : null}
        <Button variant="filled" onClick={onClose}>
          {t("common.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
