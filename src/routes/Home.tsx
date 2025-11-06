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
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

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
              {t("app.title")}
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
              {t("home.resetAll")}
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
              {pin === null ? t("home.setPin") : t("home.changePin")}
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
              {t("home.help")}
            </ResponsiveButton>
          </Toolbar>
        </AppBar>
        {needsPersistPermission ? (
          <Alert severity="error">
            <Typography variant="body1">{t("home.persistWarning")}</Typography>
            <Typography variant="body2" mt={1}>
              {t("home.persistWarningDetail")}
            </Typography>
          </Alert>
        ) : null}
        {unsupportedFeatures.length > 0 ? (
          <Alert severity="warning">
            <Typography variant="body1">
              {t("home.unsupportedFeaturesTitle")}
            </Typography>
            <Typography variant="body2" mt={1}>
              {t("home.unsupportedFeaturesDetail", {
                features: unsupportedFeatures.join(", "),
              })}
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
              {t("home.selectInstanceTitle")}
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
                    {t("home.noInstances")}
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
              {t("home.createInstance")}
            </Button>
            <Tooltip title={t("home.importTooltip")}>
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
              {t("home.importInstance")}
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
        actionLabel={t("home.resetAction")}
      />
      <PinDialog
        open={setPinPinDialogOpen}
        info={t("home.setPinTitle") /* reuse as brief info */}
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
        <DialogTitle>{t("home.resetDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography>
            {pin !== null ? t("home.pinRequiredForReset") : ""}
            {t("home.resetDialogBody")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="tonal"
            onClick={() => {
              setResetConfirmationOpen(false);
            }}
          >
            {t("common.cancel")}
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
            {pin !== null ? t("home.pin") : t("home.resetAll")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={instanceCreationDialogOpen}
        disableRestoreFocus
        onClose={() => setInstanceCreationDialogOpen(false)}
      >
        <DialogTitle>{t("home.createInstance")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("home.instanceNameLabel")}
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
            {t("common.cancel")}
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
            {t("home.create")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={setPinDialogOpen}
        disableRestoreFocus
        onClose={() => setSetPinDialogOpen(false)}
      >
        <DialogTitle>{t("home.setPinTitle")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("home.newPinLabel")}
            type="password"
            fullWidth
            autoFocus
            value={setPinInput}
            onChange={(e) => setSetPinInput(e.target.value)}
            sx={{ my: 1 }}
          />
          <TextField
            label={t("home.confirmPinLabel")}
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
            {t("common.cancel")}
          </Button>
          {pin !== null ? (
            <Button
              variant="tonal"
              onClick={() => {
                setPin(null);
                setSetPinDialogOpen(false);
              }}
            >
              {t("home.pin") + "を削除"}
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
            {t("common.ok")}
          </Button>
        </DialogActions>
      </Dialog>
      <PinDialog
        open={importPinDialogOpen}
        info={t("home.importPinInfo")}
        closeIfNoPin
        onCancel={() => setImportPinDialogOpen(false)}
        actionLabel={t("home.importAction")}
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
                setImportError(t("store.consoleCheck"));
                setImportErrorDialogOpen(true);
              }
            });
        }}
      />
      <Dialog
        open={importErrorDialogOpen}
        onClose={() => setImportErrorDialogOpen(false)}
      >
        <DialogTitle>{t("home.importErrorTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1">
            {t("home.importErrorBody")}
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
            {t("common.close")}
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
