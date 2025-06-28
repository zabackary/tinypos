import {
  AppBar,
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import NotFound from "../components/NotFound";
import OrderDialog from "../components/OrderDialog";
import Section from "../components/Section";
import {
  useInstance,
  useItemInfos,
  usePurchase,
  usePurchases,
} from "../store/hooks";
import usePOSStore from "../store/pos";

function PurchaseItem({
  purchaseId,
  onClick,
}: {
  purchaseId: string;
  onClick: () => void;
}) {
  const purchase = usePurchase(purchaseId);
  const items = useItemInfos(purchase?.instanceId ?? "");
  if (!purchase) return null;

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        borderRadius: 2,
        py: 0,
      }}
    >
      <ListItemText
        primary={purchase.date}
        secondary={purchase.items
          .map(
            (item) =>
              `${items.find((i) => i.id === item.itemId)?.name} x${
                item.quantity
              }`
          )
          .join(", ")}
        slotProps={{
          primary: {
            variant: "overline",
          },
          secondary: {
            variant: "subtitle1",
          },
        }}
      />
      <MaterialSymbolIcon icon="arrow_right" />
    </ListItemButton>
  );
}

export default function HistoryRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const instance = useInstance(params.instanceId ?? "");

  const theme = useTheme();

  const purchases = usePurchases(instance?.id ?? "");

  const deletePurchase = usePOSStore((store) => store.deletePurchase);

  // item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    null
  );

  if (!instance) return <NotFound />;

  return (
    <>
      <Stack direction="column" flexGrow={1} gap={2}>
        <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
          <Toolbar sx={{ padding: "0 !important" }}>
            <Button
              variant="tonal"
              onClick={() => {
                navigate(-1);
              }}
            >
              <MaterialSymbolIcon icon="arrow_back" size={20} />
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
              注文履歴
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack direction="column" gap={2} flexGrow={1} alignItems="center">
          <Section
            direction={"column"}
            flexGrow={1}
            width="100%"
            overflow="auto"
          >
            {purchases.length > 0 ? (
              <List>
                {purchases.map((purchase) => (
                  <PurchaseItem
                    key={purchase}
                    purchaseId={purchase}
                    onClick={() => {
                      setSelectedPurchaseId(purchase);
                      setItemDialogOpen(true);
                    }}
                  />
                ))}
              </List>
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
                  <MaterialSymbolIcon icon="orders" size={64} />
                </Box>
                <Typography variant="body1" textAlign="center">
                  注文がありません
                </Typography>
              </Stack>
            )}
          </Section>
        </Stack>
      </Stack>
      <OrderDialog
        onClose={() => setItemDialogOpen(false)}
        onDelete={() => {
          if (selectedPurchaseId) {
            deletePurchase(selectedPurchaseId);
            setItemDialogOpen(false);
          }
        }}
        open={itemDialogOpen}
        purchaseId={selectedPurchaseId ?? ""}
      />
    </>
  );
}
