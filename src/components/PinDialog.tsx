import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import usePOSStore from "../store/pos";

export interface PinDialogProps {
  open: boolean;
  info?: string;
  actionLabel?: string;
  closeIfNoPin?: boolean;
  blur?: boolean;
  onCancel: () => void;
  onEnter: () => void;
}

export default function PinDialog({
  open,
  onCancel,
  onEnter,
  closeIfNoPin = false,
  blur = false,
  actionLabel,
  info,
}: PinDialogProps) {
  const pin = usePOSStore((state) => state.pin);
  const [inputPin, setInputPin] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setInputPin("");
      if (closeIfNoPin && pin === null) {
        onEnter();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={closeIfNoPin && pin === null ? false : open}
      disableRestoreFocus
      slotProps={
        blur
          ? {
              backdrop: {
                sx: {
                  backdropFilter: "blur(16px)",
                },
              },
            }
          : undefined
      }
      onClose={() => {
        onCancel();
      }}
    >
      <DialogTitle>{t("pinDialog.title")}</DialogTitle>
      <DialogContent>
        {info ? <Typography>{info}</Typography> : null}
        {pin === null ? (
          <Typography>{t("pinDialog.noPinSet")}</Typography>
        ) : null}
        <TextField
          sx={{ mt: 1 }}
          label={t("pinDialog.label")}
          type="password"
          fullWidth
          autoFocus
          value={inputPin}
          onChange={(e) => setInputPin(e.target.value)}
          disabled={pin === null}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="tonal" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="filled"
          disabled={inputPin !== pin && pin !== null}
          onClick={() => {
            if (inputPin === pin) {
              onEnter();
            }
          }}
        >
          {actionLabel ? actionLabel : t("pinDialog.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
