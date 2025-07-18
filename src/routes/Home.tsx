import {
  Alert,
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstanceButton from "../components/InstanceButton";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import PinDialog from "../components/PinDialog";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import WelcomeDialog from "../components/WelcomeDialog";
import { useInstances } from "../store/hooks";
import usePOSStore from "../store/pos";
import { importInstance, InstanceImportError } from "../store/utils";

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
  useEffect(() => {
    if ("storage" in navigator && "persist" in navigator.storage) {
      navigator.storage.persist().then((persisted) => {
        setNeedsPersistPermission(!persisted);
      });
    }
  }, []);
  const unsupportedFeatures = useMemo(() => {
    const features = [];
    if (!("storage" in navigator && "persist" in navigator.storage)) {
      features.push("navigator.storage.persist");
    }
    if (!("startViewTransition" in document)) {
      features.push("document.startViewTransition (不必須)");
    }
    if (!("CompressionStream" in window)) {
      features.push("window.CompressionStream");
    }
    return features;
  }, []);

  // Welcome dialog
  const setHasSeenWelcome = usePOSStore((store) => store.setHasSeenWelcome);
  const hasSeenWelcome = usePOSStore((store) => store.hasSeenWelcome);
  const [welcomeOpen, setWelcomeOpen] = useState(() => !hasSeenWelcome);
  const handleWelcomeClose = () => {
    setHasSeenWelcome(true);
    setWelcomeOpen(false);
  };

  // Import
  const importDropdownRef = useRef<HTMLButtonElement>(null);
  const [importDropdownExpanded, setImportDropdownExpanded] = useState(false);
  const [importPinDialogOpen, setImportPinDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importErrorDialogOpen, setImportErrorDialogOpen] = useState(false);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
              startIcon={<MaterialSymbolIcon icon="reset_wrench" />}
              onClick={() => {
                setResetConfirmationOpen(true);
              }}
              collapsedVariant="text"
            >
              すべてをリセット
            </ResponsiveButton>
            <ResponsiveButton
              size="medium"
              variant="tonal"
              sx={{ ml: 1 }}
              startIcon={<MaterialSymbolIcon icon="pin" fill={pin !== null} />}
              onClick={() => {
                if (pin === null) {
                  setSetPinDialogOpen(true);
                } else {
                  setSetPinPinDialogOpen(true);
                }
              }}
              collapsedVariant="text"
            >
              {pin === null ? "ピンを設定" : "ピンを変更"}
            </ResponsiveButton>
            <ResponsiveButton
              size="medium"
              variant="tonal"
              sx={{ ml: 1 }}
              startIcon={<MaterialSymbolIcon icon="help" />}
              onClick={() => {
                setWelcomeOpen(true);
              }}
              collapsedVariant="text"
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
            <Typography variant="body2" mt={1}>
              ストレージが十分なら、このアラートは無視しても問題ありません。
            </Typography>
          </Alert>
        ) : null}
        {unsupportedFeatures.length > 0 ? (
          <Alert severity="warning">
            <Typography variant="body1">
              ご使用中のブラウザは必要な機能をサポートしていません。一部の機能が正しく動作しない場合があります。
            </Typography>
            <Typography variant="body2" mt={1}>
              サポートされていない機能: {unsupportedFeatures.join(", ")}
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
                      navigate(`/${instance}`, {
                        viewTransition: true,
                      });
                    }}
                    key={instance}
                    sx={{
                      viewTransitionName: `instance-${instance}`,
                    }}
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
          <ButtonGroup variant="filled" size="large">
            <Button
              onClick={() => {
                if (pin !== null) {
                  setInstanceCreationPinDialogOpen(true);
                } else {
                  handleNewInstance();
                }
              }}
              sx={{
                borderTopRightRadius: "16px !important",
                borderBottomRightRadius: "16px !important",
                "&:active": {
                  borderTopLeftRadius: "50px !important",
                  borderBottomLeftRadius: "50px !important",
                  borderTopRightRadius: "8px !important",
                  borderBottomRightRadius: "8px !important",
                },
                px: smallScreen ? 4 : undefined,
              }}
            >
              インスタンスを作成
            </Button>
            <Tooltip title="もっと見る">
              <Button
                onClick={() => {
                  setImportDropdownExpanded((prev) => !prev);
                }}
                sx={{
                  ml: 0.5,
                  borderTopLeftRadius: importDropdownExpanded
                    ? "50px !important"
                    : "16px !important",
                  borderBottomLeftRadius: importDropdownExpanded
                    ? "50px !important"
                    : "16px !important",
                  "&:active": {
                    borderTopLeftRadius: importDropdownExpanded
                      ? "32px !important"
                      : "32px !important",
                    borderBottomLeftRadius: importDropdownExpanded
                      ? "32px !important"
                      : "32px !important",
                    borderTopRightRadius: "50px !important",
                    borderBottomRightRadius: "50px !important",
                  },
                  px: smallScreen ? 2 : 3,
                }}
                ref={importDropdownRef}
              >
                <MaterialSymbolIcon
                  icon="arrow_drop_down"
                  sx={{
                    transform: importDropdownExpanded
                      ? "rotate(180deg)"
                      : "none",
                    transition: (theme) =>
                      theme.transitions.create("transform"),
                  }}
                  size={36}
                />
              </Button>
            </Tooltip>
          </ButtonGroup>
          <Menu
            anchorEl={importDropdownRef.current}
            open={importDropdownExpanded}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            onClose={() => setImportDropdownExpanded(false)}
          >
            <MenuItem
              onClick={() => {
                setImportDropdownExpanded(false);
                setImportPinDialogOpen(true);
              }}
            >
              インスタンスをインポート
            </MenuItem>
          </Menu>
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
              navigate(`/${id}`, {
                viewTransition: true,
              });
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
      <PinDialog
        open={importPinDialogOpen}
        info="インポートするには、PINを入力してください。"
        closeIfNoPin
        onCancel={() => setImportPinDialogOpen(false)}
        actionLabel="インポート"
        onEnter={() => {
          setImportPinDialogOpen(false);
          importInstance()
            .then((id) => {
              navigate(`/${id}`, {
                viewTransition: true,
              });
            })
            .catch((error) => {
              console.error("Failed to import instance:", error);
              if (error instanceof InstanceImportError) {
                setImportError(error.humanMessage);
                setImportErrorDialogOpen(true);
              } else {
                setImportError("コンソールを確認してください。");
                setImportErrorDialogOpen(true);
              }
            });
        }}
      />
      <Dialog
        open={importErrorDialogOpen}
        onClose={() => setImportErrorDialogOpen(false)}
      >
        <DialogTitle>インポートエラー</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1">
            インポート中にエラーが発生しました。
          </DialogContentText>
          <DialogContentText variant="body2" mt={1}>
            {importError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="filled"
            onClick={() => setImportErrorDialogOpen(false)}
          >
            閉じる
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
