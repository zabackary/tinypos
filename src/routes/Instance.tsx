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
import { useNavigate, useParams } from "react-router-dom";
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

  if (!instance) return <NotFound />;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar sx={{ padding: "0 !important" }}>
          <ResponsiveButton
            variant="tonal"
            onClick={() => {
              navigate("..");
            }}
            startIcon={<MaterialSymbolIcon icon="arrow_back" />}
            alwaysCollapse
          >
            戻る
          </ResponsiveButton>
          <ResponsiveButton
            variant="tonal"
            sx={{ ml: 1 }}
            startIcon={<MaterialSymbolIcon icon="edit" />}
            onClick={() => {
              navigate("edit");
            }}
            collapsedVariant="text"
          >
            編集
          </ResponsiveButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            {instance.name}
          </Typography>
          <ResponsiveButton
            variant="tonal"
            startIcon={<MaterialSymbolIcon icon="orders" />}
            onClick={() => {
              navigate("history");
            }}
            collapsedVariant="text"
          >
            注文履歴
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
            この注文を削除
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
                }}
              >
                <MaterialSymbolIcon icon="inventory_2" size={64} />
              </Box>
              <Typography variant="body1" textAlign="center">
                商品がありません。
              </Typography>
              <Typography variant="body2" textAlign="center">
                上の編集ボタンをクリックして商品を追加してください。
              </Typography>
            </Stack>
          )}
        </Section>
        <Section direction={"column"} justifyContent={"center"} flexGrow={0}>
          <PaymentColumn
            label={`合計 (${Object.values(currentOrder).reduce(
              (a, b) => a + b,
              0
            )}品)`}
            amount={total.toLocaleString("ja-JP")}
          />
          <PaymentColumn label="お預かり金" amount={paidAmount} isTyping />
          <PaymentColumn
            label="お釣り"
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
        <SnackbarContent message="注文が削除されました" />
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
            注文が保存されました
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
            注文を削除
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
