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
      <DialogTitle>ピンを入力</DialogTitle>
      <DialogContent>
        {info ? <Typography>{info}</Typography> : null}
        {pin === null ? (
          <Typography>
            ピンが設定されていませんので、確認ボタンを押してください。
          </Typography>
        ) : null}
        <TextField
          sx={{ mt: 1 }}
          label="ピン"
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
          キャンセル
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
          {actionLabel ? actionLabel : "確認"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
