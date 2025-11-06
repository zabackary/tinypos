import {
  AppBar,
  Box,
  Button,
  IconButton,
  keyframes,
  Popover,
  Snackbar,
  SnackbarContent,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useNavigate,
  useParams,
  useViewTransitionState,
} from "react-router-dom";
import ItemButton from "../components/ItemButton";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import NotFound from "../components/NotFound";
import NumberPad from "../components/NumberPad";
import PaymentColumn from "../components/PaymentColumn";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import { useInstance, useInstanceItems } from "../store/hooks";
import usePOSStore from "../store/pos";

export default function InstanceRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const instance = useInstance(params.instanceId ?? "");
  const items = useInstanceItems(instance?.id ?? "");
  const theme = useTheme();
  const [deletedSnackbarOpen, setDeletedSnackbarOpen] = useState(false);
  const [purchaseSavedSnackbarOpen, setPurchaseSavedSnackbarOpen] =
    useState(false);

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

  const [lastPurchaseId, setLastPurchaseId] = useState<string | null>(null);

  const { t } = useTranslation();

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
              setCurrentOrder({});
              setPaidAmount("");
              setDeletedSnackbarOpen(true);
            }}
            collapsedVariant="text"
          >
            {t("instance.deleteOrder")}
          </ResponsiveButton>
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
            setLastPurchaseId(
              createPurchase(
                instance.id,
                Object.entries(currentOrder).map(([itemId, quantity]) => ({
                  itemId,
                  quantity,
                })),
                total,
                Number(paidAmount)
              )
            );
            // Reset the order and paid amount
            setCurrentOrder({});
            setPaidAmount("");

            // Show the snackbar
            setPurchaseSavedSnackbarOpen(true);
            setTimeout(() => {
              setPurchaseSavedSnackbarOpen(false);
            }, 5000);
          }}
        />
      </Stack>
      <Snackbar
        open={deletedSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setDeletedSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <SnackbarContent message={t("instance.orderDeletedSnackbar")} />
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
            color="error"
            size="small"
            onClick={() => {
              if (lastPurchaseId) {
                deletePurchase(lastPurchaseId);
                setLastPurchaseId(null);
                setPurchaseSavedSnackbarOpen(false);
                setDeletedSnackbarOpen(true);
              }
            }}
            sx={{
              mb: 2,
            }}
          >
            {t("instance.deleteOrderButton")}
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
