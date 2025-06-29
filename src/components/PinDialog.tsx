import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import usePOSStore from "../store/pos";

export interface PinDialogProps {
  open: boolean;
  info?: string;
  actionLabel?: string;
  onCancel: () => void;
  onEnter: () => void;
}

export default function PinDialog({
  open,
  onCancel,
  onEnter,
  actionLabel,
  info,
}: PinDialogProps) {
  const pin = usePOSStore((state) => state.pin);
  const [inputPin, setInputPin] = useState("");

  return (
    <Dialog open={open} disableRestoreFocus>
      <DialogTitle>ピンを入力</DialogTitle>
      <DialogContent>
        {info ? <Typography>{info}</Typography> : null}
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
          disabled={inputPin !== pin}
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
