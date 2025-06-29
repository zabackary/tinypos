import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstanceButton from "../components/InstanceButton";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import PinDialog from "../components/PinDialog";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import { useInstances } from "../store/hooks";
import usePOSStore from "../store/pos";

export default function HomeRoute() {
  const instances = useInstances();
  const navigate = useNavigate();

  const createInstance = usePOSStore((store) => store.createInstance);
  const pin = usePOSStore((store) => store.pin);
  const reset = usePOSStore((store) => store.reset);

  const handleNewInstance = () => {
    setInstanceCreationDialogOpen(true);
    setInstanceCreationName("");
  };

  const [resetPinDialogOpen, setResetPinDialogOpen] = useState(false);
  const [resetPinConfirmationOpen, setResetPinConfirmationOpen] =
    useState(false);

  const [instanceCreationDialogOpen, setInstanceCreationDialogOpen] =
    useState(false);
  const [instanceCreationName, setInstanceCreationName] = useState("");

  return (
    <>
      <Stack direction="column" flexGrow={1} gap={2}>
        <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
          <Toolbar sx={{ padding: "0 !important" }}>
            <Typography variant="h6" sx={{ flexGrow: 1, px: 2 }}>
              tinyPOS
            </Typography>
            <ResponsiveButton
              size="medium"
              variant="tonal"
              startIcon={
                <MaterialSymbolIcon icon="reset_wrench" fill size={20} />
              }
              onClick={() => {
                setResetPinConfirmationOpen(true);
              }}
            >
              すべてをリーセット
            </ResponsiveButton>
          </Toolbar>
        </AppBar>
        <Stack direction="column" gap={2} flexGrow={1} alignItems="center">
          <Section
            direction={"column"}
            flexGrow={1}
            alignItems="center"
            gap={2}
            width="100%"
          >
            <Typography textAlign="center" variant="h4" component="h1" mt={2}>
              インスタンスをお選びください
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
              gap={2}
            >
              {instances.length > 0 ? (
                instances.map((instance) => (
                  <InstanceButton
                    id={instance}
                    onClick={() => {
                      navigate(`/${instance}`);
                    }}
                    key={instance}
                  />
                ))
              ) : (
                <Stack
                  direction="column"
                  alignItems="center"
                  gap={1}
                  justifyContent="center"
                  flexGrow={1}
                >
                  <Box
                    sx={{
                      bgcolor: (theme) => theme.palette.surfaceVariant.main,
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 6,
                    }}
                  >
                    <MaterialSymbolIcon icon="box" size={64} />
                  </Box>
                  <Typography variant="body1" textAlign="center">
                    インスタンスがありません
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Section>
          <Button size="large" variant="filled" onClick={handleNewInstance}>
            インスタンスを作成
          </Button>
        </Stack>
      </Stack>
      <PinDialog
        open={resetPinDialogOpen}
        onCancel={() => setResetPinDialogOpen(false)}
        onEnter={() => {
          reset();
          setResetPinDialogOpen(false);
        }}
        actionLabel="リセット"
      />
      <Dialog
        open={resetPinConfirmationOpen}
        onClose={() => setResetPinConfirmationOpen(false)}
      >
        <DialogTitle>
          すべてのデータ（注文・入力した商品など）をリセットします
        </DialogTitle>
        <DialogContent>
          <Typography>
            {pin !== null ? "リセットするには、ピンを入力してください。" : ""}
            リセット後はデータの回復ができません。本当にリセットしますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="tonal"
            onClick={() => {
              setResetPinConfirmationOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="filled"
            onClick={() => {
              if (pin !== null) {
                setResetPinDialogOpen(true);
              } else {
                reset();
              }
              setResetPinConfirmationOpen(false);
            }}
          >
            {pin !== null ? "ピンを入力" : "リセット"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={instanceCreationDialogOpen}
        disableRestoreFocus
        onClose={() => setInstanceCreationDialogOpen(false)}
      >
        <DialogTitle>インスタンスを作成</DialogTitle>
        <DialogContent>
          <TextField
            label="インスタンス名"
            variant="outlined"
            fullWidth
            autoFocus
            value={instanceCreationName}
            sx={{ mt: 1 }}
            onChange={(e) => setInstanceCreationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="tonal"
            onClick={() => {
              setInstanceCreationDialogOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="filled"
            disabled={instanceCreationName.trim() === ""}
            onClick={() => {
              const id = createInstance(instanceCreationName);
              setInstanceCreationDialogOpen(false);
              navigate(`/${id}`);
            }}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
