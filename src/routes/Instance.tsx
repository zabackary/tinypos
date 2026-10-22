import {
  AppBar,
  Box,
  Button,
  IconButton,
  keyframes,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Snackbar,
  SnackbarContent,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useNavigate,
  useParams,
  useViewTransitionState,
} from "react-router-dom";
import ItemButton from "../components/ItemButton";
import MergeFlow from "../components/MergeFlow";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import NotFound from "../components/NotFound";
import NumberPad from "../components/NumberPad";
import PaymentColumn from "../components/PaymentColumn";
import PinDialog from "../components/PinDialog";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import { useInstance, useInstanceItems } from "../store/hooks";
import usePOSStore from "../store/pos";
import { exportInstance } from "../store/utils";

export default function InstanceRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const instance = useInstance(params.instanceId ?? "");
  const items = useInstanceItems(instance?.id ?? "");
  const theme = useTheme();
  const [deletedSnackbarOpen, setDeletedSnackbarOpen] = useState(false);
  const [purchaseSavedSnackbarOpen, setPurchaseSavedSnackbarOpen] =
    useState(false);
  const [clearedOrder, setClearedOrder] = useState<{
    order: Record<string, number>;
    paidAmount: string;
  } | null>(null);

  const [paidAmount, setPaidAmount] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Record<string, number>>(
    () => ({})
  );
  const total = useMemo(() => {
    return Object.entries(currentOrder).reduce((sum, [itemId, quantity]) => {
      const item = items.find((item) => item.id === itemId);
      if (!item) return sum;
      return sum + item.price * quantity;
    }, 0);
  }, [currentOrder, items]);
  const change = Number(paidAmount) - total;

  const createPurchase = usePOSStore((store) => store.createPurchase);
  const deletePurchase = usePOSStore((store) => store.deletePurchase);

  const [lastPurchase, setLastPurchase] = useState<{
    id: string;
    order: Record<string, number>;
    paidAmount: string;
  } | null>(null);

  // Auto-close the popup 5s after the latest purchase; the cleanup cancels the
  // previous purchase's timer so it can't close the popup for a newer order.
  const lastPurchaseId = lastPurchase?.id;
  useEffect(() => {
    if (!lastPurchaseId) return;
    const timeout = setTimeout(() => {
      setPurchaseSavedSnackbarOpen(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [lastPurchaseId]);

  const { t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [exportPinDialogOpen, setExportPinDialogOpen] = useState(false);
  const [mergePinDialogOpen, setMergePinDialogOpen] = useState(false);
  const [mergeActive, setMergeActive] = useState(false);

  // Keep the screen awake. The browser releases the lock whenever the page is
  // hidden, so it is re-requested when the page becomes visible again.
  const wakeLockSupported = "wakeLock" in navigator;
  const [keepAwake, setKeepAwake] = useState(true);
  useEffect(() => {
    if (!keepAwake || !wakeLockSupported) return;
    let cancelled = false;
    let sentinel: WakeLockSentinel | null = null;
    const acquire = () => {
      if (document.visibilityState !== "visible") return;
      navigator.wakeLock
        .request("screen")
        .then((lock) => {
          if (cancelled) lock.release();
          else sentinel = lock;
        })
        .catch(() => {
          // Denied (e.g. low battery); nothing useful to do.
        });
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", acquire);
      sentinel?.release();
    };
  }, [keepAwake, wakeLockSupported]);

  const isTransitioningEditItems = useViewTransitionState(
    `/${instance?.id}/edit`
  );
  const isTransitioningHistory = useViewTransitionState(
    `/${instance?.id}/history`
  );

  if (!instance) return <NotFound />;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar sx={{ padding: "0 !important" }}>
          <ResponsiveButton
            variant="tonal"
            onClick={() => {
              navigate("..", {
                viewTransition: true,
              });
            }}
            startIcon={<MaterialSymbolIcon icon="arrow_back" />}
            alwaysCollapse
          >
            {t("instance.back")}
          </ResponsiveButton>
          <ResponsiveButton
            variant="tonal"
            sx={{ ml: 1 }}
            startIcon={<MaterialSymbolIcon icon="edit" />}
            onClick={() => {
              navigate("edit", {
                viewTransition: true,
              });
            }}
            collapsedVariant="text"
          >
            {t("instance.edit")}
          </ResponsiveButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            {instance.name}
          </Typography>
          <ResponsiveButton
            variant="tonal"
            startIcon={<MaterialSymbolIcon icon="orders" />}
            onClick={() => {
              navigate("history", {
                viewTransition: true,
              });
            }}
            collapsedVariant="text"
          >
            {t("instance.orderHistory")}
          </ResponsiveButton>
          <ResponsiveButton
            variant="tonal"
            sx={{ ml: 1 }}
            startIcon={<MaterialSymbolIcon icon="delete" />}
            onClick={() => {
              setClearedOrder(
                Object.keys(currentOrder).length > 0 || paidAmount !== ""
                  ? { order: currentOrder, paidAmount }
                  : null
              );
              setCurrentOrder({});
              setPaidAmount("");
              setDeletedSnackbarOpen(true);
            }}
            collapsedVariant="text"
          >
            {t("instance.deleteOrder")}
          </ResponsiveButton>
          <IconButton
            ref={menuButtonRef}
            sx={{ ml: 1 }}
            aria-label={t("instance.more")}
            onClick={() => setMenuOpen(true)}
          >
            <MaterialSymbolIcon icon="more_vert" />
          </IconButton>
          <Menu
            anchorEl={menuButtonRef.current}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          >
            <MenuItem
              onClick={() => {
                setMenuOpen(false);
                setExportPinDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <MaterialSymbolIcon icon="import_export" />
              </ListItemIcon>
              <ListItemText primary={t("instance.export")} />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuOpen(false);
                setMergePinDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <MaterialSymbolIcon icon="call_merge" />
              </ListItemIcon>
              <ListItemText primary={t("instance.mergeInto")} />
            </MenuItem>
            <MenuItem
              disabled={!wakeLockSupported}
              onClick={() => {
                setMenuOpen(false);
                setKeepAwake((prev) => !prev);
              }}
            >
              <ListItemIcon>
                <MaterialSymbolIcon icon="brightness_alert" fill={keepAwake} />
              </ListItemIcon>
              <ListItemText
                primary={t("instance.keepAwake")}
                secondary={
                  wakeLockSupported
                    ? keepAwake
                      ? t("instance.keepAwakeOn")
                      : undefined
                    : t("instance.keepAwakeUnsupported")
                }
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Stack
        direction="row"
        gap={2}
        flexGrow={1}
        sx={{
          overflowY: "hidden",
          minHeight: 500,
          viewTransitionName: `instance-${instance.id}`,
        }}
      >
        <Section
          direction="row"
          gap={2}
          flexGrow={1}
          justifyContent="center"
          flexWrap="wrap"
          overflow="auto"
          minWidth={200}
          sx={{
            viewTransitionName:
              isTransitioningEditItems || isTransitioningHistory
                ? `instance-${instance.id}-items`
                : "none",
          }}
        >
          {items.length > 0 ? (
            <Stack
              flexGrow={1}
              justifyContent="stretch"
              flexWrap="wrap"
              overflow="auto"
              alignContent="center"
              direction="row"
              gap={2}
            >
              {items.map((item) => (
                <ItemButton
                  key={item.id}
                  id={item.id}
                  selectedCount={currentOrder[item.id] || 0}
                  onClick={() => {
                    setCurrentOrder((prev) => ({
                      ...prev,
                      [item.id]: (prev[item.id] || 0) + 1,
                    }));
                  }}
                  sx={{
                    flexGrow: 1,
                    width: 220,
                  }}
                />
              ))}
            </Stack>
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
                  bgcolor: theme.palette.surfaceVariant.main,
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 6,
                  viewTransitionName:
                    isTransitioningEditItems || isTransitioningHistory
                      ? `instance-${instance.id}-empty-state-icon`
                      : "none",
                }}
              >
                <MaterialSymbolIcon icon="inventory_2" size={64} />
              </Box>
              <Typography
                variant="body1"
                textAlign="center"
                sx={{
                  viewTransitionName:
                    isTransitioningEditItems || isTransitioningHistory
                      ? `instance-${instance.id}-empty-state-text`
                      : "none",
                }}
              >
                {t("instance.noItems")}
              </Typography>
              <Typography variant="body2" textAlign="center">
                {t("instance.addItemsHint")}
              </Typography>
            </Stack>
          )}
        </Section>
        <Section direction={"column"} justifyContent={"center"} flexGrow={0}>
          <PaymentColumn
            label={t("instance.totalLabel", {
              count: Object.values(currentOrder).reduce((a, b) => a + b, 0),
            })}
            amount={total.toLocaleString("ja-JP")}
          />
          <PaymentColumn
            label={t("instance.paidLabel")}
            amount={paidAmount}
            isTyping
          />
          <PaymentColumn
            label={t("instance.changeLabel")}
            error={change < 0}
            amount={change.toLocaleString("ja-JP")}
          />
        </Section>
        <NumberPad
          onNumberClick={(value) => {
            setPaidAmount((prev) => `${prev}${value}`);
          }}
          onClear={() => setPaidAmount("")}
          disabled={change < 0 || Object.keys(currentOrder).length === 0}
          onSubmit={() => {
            if (change < 0 || Object.keys(currentOrder).length === 0) return;
            // Submit the purchase
            setLastPurchase({
              id: createPurchase(
                instance.id,
                Object.entries(currentOrder).map(([itemId, quantity]) => ({
                  itemId,
                  quantity,
                })),
                total,
                Number(paidAmount)
              ),
              order: currentOrder,
              paidAmount,
            });
            // Reset the order and paid amount
            setCurrentOrder({});
            setPaidAmount("");

            // Show the snackbar
            setPurchaseSavedSnackbarOpen(true);
          }}
        />
      </Stack>
      <Snackbar
        open={deletedSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setDeletedSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <SnackbarContent
          message={t("instance.orderDeletedSnackbar")}
          action={
            clearedOrder && (
              <Button
                variant="text"
                size="small"
                sx={{ color: theme.palette.inversePrimary.main }}
                onClick={() => {
                  setCurrentOrder(clearedOrder.order);
                  setPaidAmount(clearedOrder.paidAmount);
                  setClearedOrder(null);
                  setDeletedSnackbarOpen(false);
                }}
              >
                {t("instance.undo")}
              </Button>
            )
          }
        />
      </Snackbar>
      <Popover
        open={purchaseSavedSnackbarOpen}
        hideBackdrop
        sx={{
          pointerEvents: "none",
          zIndex: theme.zIndex.snackbar,
        }}
        onClose={() => setPurchaseSavedSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              pointerEvents: "auto",
              borderRadius: 8,
            },
          },
        }}
      >
        <Stack direction="column" alignItems="center">
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              color: theme.palette.onSurface.main,
            }}
          >
            <MaterialSymbolIcon
              icon="close"
              fill
              size={24}
              onClick={() => setPurchaseSavedSnackbarOpen(false)}
            />
          </IconButton>
          <MaterialSymbolIcon
            icon="check_circle"
            fill
            size={96}
            sx={{
              color: theme.palette.primary.main,
              m: 3,
              animation: `${keyframes`
                0% {
                  transform: scale(0);
                }

                70% {
                  transform: scale(1.2);}

                100% {
                  transform: scale(1);
                }
              `} 0.6s ${theme.transitions.easing.easeOut} forwards`,
            }}
          />
          <Typography
            variant="h5"
            component="h2"
            textAlign="center"
            mx={3}
            mb={2}
          >
            {t("instance.orderSavedTitle")}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              if (lastPurchase) {
                deletePurchase(lastPurchase.id);
                setCurrentOrder(lastPurchase.order);
                setPaidAmount(lastPurchase.paidAmount);
                setLastPurchase(null);
                setPurchaseSavedSnackbarOpen(false);
              }
            }}
            sx={{
              mb: 2,
            }}
          >
            {t("instance.undo")}
          </Button>
        </Stack>
      </Popover>
      <PinDialog
        open={exportPinDialogOpen}
        info={t("instanceButton.pinInfoExport")}
        actionLabel={t("instanceButton.export")}
        closeIfNoPin
        onCancel={() => setExportPinDialogOpen(false)}
        onEnter={() => {
          exportInstance(instance.id);
          setExportPinDialogOpen(false);
        }}
      />
      <PinDialog
        open={mergePinDialogOpen}
        info={t("merge.pinInfo")}
        actionLabel={t("merge.menuItem")}
        closeIfNoPin
        onCancel={() => setMergePinDialogOpen(false)}
        onEnter={() => {
          setMergePinDialogOpen(false);
          setMergeActive(true);
        }}
      />
      {mergeActive && (
        <MergeFlow
          instanceId={instance.id}
          onFinished={() => setMergeActive(false)}
        />
      )}
    </>
  );
}
