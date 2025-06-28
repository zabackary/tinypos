import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstanceButton from "../components/InstanceButton";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
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

  const [resetPin, setResetPin] = useState("");
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
            <Button
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
            </Button>
            <IconButton sx={{ ml: 1 }}>
              <MaterialSymbolIcon icon="more_vert" fill size={20} />
              <Menu open={false}>
                <MenuItem onClick={() => {}}>Action 1</MenuItem>
                <MenuItem onClick={() => {}}>Action 2</MenuItem>
              </Menu>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Stack direction="row" gap={2} flexGrow={1}>
          <Section direction={"column"} flexGrow={1} alignItems="center">
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
            <Button size="large" variant="filled" onClick={handleNewInstance}>
              インスタンスを作成
            </Button>
          </Section>
        </Stack>
      </Stack>
      <Dialog
        open={resetPinDialogOpen}
        onClose={() => setResetPinDialogOpen(false)}
      >
        <DialogTitle>ピンを入力</DialogTitle>
        <DialogContent>
          <TextField
            label="ピン"
            variant="outlined"
            type="password"
            fullWidth
            value={resetPin}
            sx={{ mt: 1 }}
            onChange={(e) => setResetPin(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="tonal"
            onClick={() => {
              setResetPinDialogOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="filled"
            disabled={resetPin !== pin}
            onClick={() => {
              reset();
            }}
          >
            リーセット
          </Button>
        </DialogActions>
      </Dialog>
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
