import {
  Alert,
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstanceButton from "../components/InstanceButton";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import PinDialog from "../components/PinDialog";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import WelcomeDialog from "../components/WelcomeDialog";
import { useInstances } from "../store/hooks";
import usePOSStore from "../store/pos";

export default function HomeRoute() {
  const instances = useInstances();
  const navigate = useNavigate();

  const createInstance = usePOSStore((store) => store.createInstance);
  const setPin = usePOSStore((store) => store.setPin);
  const pin = usePOSStore((store) => store.pin);
  const reset = usePOSStore((store) => store.reset);

  const handleNewInstance = () => {
    setInstanceCreationDialogOpen(true);
    setInstanceCreationName("");
  };

  const [resetPinDialogOpen, setResetPinDialogOpen] = useState(false);
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);

  const [setPinDialogOpen, setSetPinDialogOpen] = useState(false);
  const [setPinInput, setSetPinInput] = useState("");
  const [setPinConfirmInput, setSetPinConfirmInput] = useState("");
  const [setPinPinDialogOpen, setSetPinPinDialogOpen] = useState(false);

  const [instanceCreationPinDialogOpen, setInstanceCreationPinDialogOpen] =
    useState(false);
  const [instanceCreationDialogOpen, setInstanceCreationDialogOpen] =
    useState(false);
  const [instanceCreationName, setInstanceCreationName] = useState("");

  const [needsPersistPermission, setNeedsPersistPermission] = useState(false);

  // Welcome dialog
  const setHasSeenWelcome = usePOSStore((store) => store.setHasSeenWelcome);
  const hasSeenWelcome = usePOSStore((store) => store.hasSeenWelcome);
  const [welcomeOpen, setWelcomeOpen] = useState(() => !hasSeenWelcome);
  const handleWelcomeClose = () => {
    setHasSeenWelcome(true);
    setWelcomeOpen(false);
  };

  useEffect(() => {
    if ("storage" in navigator && "persist" in navigator.storage) {
      navigator.storage.persist().then((persisted) => {
        setNeedsPersistPermission(!persisted);
      });
    }
  });

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
              startIcon={<MaterialSymbolIcon icon="reset_wrench" size={20} />}
              onClick={() => {
                setResetConfirmationOpen(true);
              }}
            >
              すべてをリセット
            </ResponsiveButton>
            <ResponsiveButton
              size="medium"
              variant="tonal"
              sx={{ ml: 1 }}
              startIcon={
                <MaterialSymbolIcon icon="pin" size={20} fill={pin !== null} />
              }
              onClick={() => {
                if (pin === null) {
                  setSetPinDialogOpen(true);
                } else {
                  setSetPinPinDialogOpen(true);
                }
              }}
            >
              {pin === null ? "ピンを設定" : "ピンを変更"}
            </ResponsiveButton>
            <ResponsiveButton
              size="medium"
              variant="tonal"
              sx={{ ml: 1 }}
              startIcon={<MaterialSymbolIcon icon="help" size={20} />}
              onClick={() => {
                setWelcomeOpen(true);
              }}
            >
              ヘルプ
            </ResponsiveButton>
          </Toolbar>
        </AppBar>
        {needsPersistPermission ? (
          <Alert severity="error">
            <Typography variant="body1">
              現在、ストレージが足りなければ保存することができない場合がございますのでご注意ください。Chromeでは、インストール後に保存することができるようになります。
            </Typography>
            <Typography variant="body2">
              ストレージが十分なら、このアラートは無視しても問題ありません。
            </Typography>
          </Alert>
        ) : null}
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
          <Button
            size="large"
            variant="filled"
            onClick={() => {
              if (pin !== null) {
                setInstanceCreationPinDialogOpen(true);
              } else {
                handleNewInstance();
              }
            }}
          >
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
      <PinDialog
        open={setPinPinDialogOpen}
        info="現在のピンを入力してください。"
        onCancel={() => setSetPinPinDialogOpen(false)}
        onEnter={() => {
          setSetPinPinDialogOpen(false);
          setSetPinDialogOpen(true);
        }}
      />
      <PinDialog
        open={instanceCreationPinDialogOpen}
        onCancel={() => setInstanceCreationPinDialogOpen(false)}
        onEnter={() => {
          setInstanceCreationPinDialogOpen(false);
          handleNewInstance();
        }}
      />
      <Dialog
        open={resetConfirmationOpen}
        onClose={() => setResetConfirmationOpen(false)}
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
              setResetConfirmationOpen(false);
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
              setResetConfirmationOpen(false);
            }}
            sx={{
              color: (theme) => theme.palette.onError.main,
              backgroundColor: (theme) => theme.palette.error.main,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.error.main,
              },
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
      <Dialog
        open={setPinDialogOpen}
        disableRestoreFocus
        onClose={() => setSetPinDialogOpen(false)}
      >
        <DialogTitle>ピンを設定</DialogTitle>
        <DialogContent>
          <TextField
            label="新しいピン"
            type="password"
            fullWidth
            autoFocus
            value={setPinInput}
            onChange={(e) => setSetPinInput(e.target.value)}
            sx={{ my: 1 }}
          />
          <TextField
            label="ピンの確認"
            type="password"
            fullWidth
            value={setPinConfirmInput}
            onChange={(e) => setSetPinConfirmInput(e.target.value)}
            sx={{ my: 1 }}
            error={
              setPinInput !== setPinConfirmInput &&
              setPinConfirmInput.trim() !== ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="tonal"
            onClick={() => {
              setSetPinDialogOpen(false);
            }}
          >
            キャンセル
          </Button>
          {pin !== null ? (
            <Button
              variant="tonal"
              onClick={() => {
                setPin(null);
                setSetPinDialogOpen(false);
              }}
            >
              ピンを削除
            </Button>
          ) : null}
          <Button
            variant="filled"
            disabled={
              setPinInput.trim() === "" ||
              setPinConfirmInput.trim() === "" ||
              setPinInput !== setPinConfirmInput
            }
            onClick={() => {
              setPin(setPinInput);
              setSetPinDialogOpen(false);
            }}
          >
            設定
          </Button>
        </DialogActions>
      </Dialog>
      <WelcomeDialog
        open={welcomeOpen}
        onClose={handleWelcomeClose}
        headerIsHelp={hasSeenWelcome}
      />
    </>
  );
}
