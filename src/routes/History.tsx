import {
  AppBar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  type SxProps,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MaterialSymbolIcon, {
  type MaterialSymbolIconProps,
} from "../components/MaterialSymbolIcon";
import NotFound from "../components/NotFound";
import OrderDialog from "../components/OrderDialog";
import PinDialog from "../components/PinDialog";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import {
  useInstance,
  useItemInfos,
  usePurchase,
  usePurchases,
  usePurchasesStats,
} from "../store/hooks";
import usePOSStore from "../store/pos";
import { downloadInstanceCsv } from "../store/utils";

function PurchaseItem({
  purchaseId,
  onClick,
  sx = {},
}: {
  purchaseId: string;
  onClick: () => void;
  sx?: SxProps;
}) {
  const purchase = usePurchase(purchaseId);
  const allItems = useItemInfos(purchase?.instanceId ?? "", true);
  if (!purchase) return null;

  return (
    <ListItem
      disablePadding
      disableGutters
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 1,
        ":first-of-type": {
          borderTopLeftRadius: 6 * 4,
          borderTopRightRadius: 6 * 4,
        },
        ":last-of-type": {
          borderBottomLeftRadius: 6 * 4,
          borderBottomRightRadius: 6 * 4,
        },
        ...sx,
      }}
    >
      <ListItemButton
        onClick={onClick}
        sx={{
          py: 0,
        }}
      >
        <ListItemText
          primary={purchase.date}
          secondary={purchase.items
            .map(
              (item) =>
                `${allItems.find((i) => i.id === item.itemId)?.name} x${
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
          sx={{
            m: 0,
          }}
        />
        <MaterialSymbolIcon icon="arrow_right" />
      </ListItemButton>
    </ListItem>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: MaterialSymbolIconProps["icon"];
}) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{
        width: "100%",
        padding: 3,
        borderRadius: 4,
        backgroundColor: theme.palette.surfaceContainerLowest.main,
      }}
    >
      <MaterialSymbolIcon icon={icon} size={48} color="primary" />
      <Stack>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
        <Typography variant="body1" noWrap>
          {value}
        </Typography>
      </Stack>
    </Stack>
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

  const [deletePinDialogOpen, setDeletePinDialogOpen] = useState(false);
  const [downloadPinDialogOpen, setDownloadPinDialogOpen] = useState(false);

  const stats = usePurchasesStats(instance?.id ?? "");

  if (!instance) return <NotFound />;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar sx={{ padding: "0 !important" }}>
          <ResponsiveButton
            alwaysCollapse
            startIcon={<MaterialSymbolIcon icon="arrow_back" />}
            variant="tonal"
            onClick={() => {
              navigate(-1);
            }}
          >
            戻る
          </ResponsiveButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            注文履歴
          </Typography>
          <ResponsiveButton
            variant="tonal"
            startIcon={<MaterialSymbolIcon icon="download" />}
            onClick={() => {
              setDownloadPinDialogOpen(true);
            }}
            collapsedVariant="text"
          >
            CSVダウンロード
          </ResponsiveButton>
        </Toolbar>
      </AppBar>
      <Stack
        direction="column"
        gap={1}
        flexGrow={1}
        alignItems="center"
        overflow="auto"
        borderRadius={4}
        sx={{
          viewTransitionName: `instance-${instance.id}-items`,
        }}
      >
        {stats ? (
          <Stack
            direction="row"
            overflow="auto"
            alignItems="stretch"
            gap={1}
            width="100%"
            borderRadius={4}
            minHeight="min-content"
          >
            <StatsCard
              title="注文数"
              value={`${stats.totalCount.toLocaleString()}件`}
              icon="orders"
            />
            <StatsCard
              title="平均注文の売上"
              value={`${stats.averageRevenue.toLocaleString()}円`}
              icon="inventory"
            />
            <StatsCard
              title="売り上げ"
              value={`${stats.totalRevenue.toLocaleString()}円`}
              icon="money"
            />
          </Stack>
        ) : null}
        {purchases.length > 0 ? (
          <List
            sx={{
              width: "100%",
            }}
            disablePadding
          >
            {purchases.map((purchase) => (
              <PurchaseItem
                key={purchase}
                purchaseId={purchase}
                onClick={() => {
                  setSelectedPurchaseId(purchase);
                  setItemDialogOpen(true);
                }}
                sx={{
                  backgroundColor: theme.palette.surfaceContainerLowest.main,
                }}
              />
            ))}
          </List>
        ) : (
          <Section
            direction={"column"}
            flexGrow={1}
            width="100%"
            overflow="auto"
          >
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
                  viewTransitionName: `instance-${instance.id}-empty-state-icon`,
                }}
              >
                <MaterialSymbolIcon icon="orders" size={64} />
              </Box>
              <Typography
                variant="body1"
                textAlign="center"
                sx={{
                  viewTransitionName: `instance-${instance.id}-empty-state-text`,
                }}
              >
                注文がありません
              </Typography>
            </Stack>
          </Section>
        )}
      </Stack>
      <OrderDialog
        onClose={() => setItemDialogOpen(false)}
        onDelete={() => {
          if (selectedPurchaseId) {
            setDeletePinDialogOpen(true);
          }
        }}
        open={itemDialogOpen}
        purchaseId={selectedPurchaseId ?? ""}
      />
      <PinDialog
        open={deletePinDialogOpen}
        closeIfNoPin
        onCancel={() => {
          setDeletePinDialogOpen(false);
        }}
        onEnter={() => {
          if (selectedPurchaseId) {
            deletePurchase(selectedPurchaseId);
            setItemDialogOpen(false);
          }
          setDeletePinDialogOpen(false);
        }}
      />
      <PinDialog
        open={downloadPinDialogOpen}
        info="データのCSVをダウンロードするには、PINを入力してください。"
        closeIfNoPin
        onCancel={() => {
          setDownloadPinDialogOpen(false);
        }}
        onEnter={() => {
          downloadInstanceCsv(instance.id);
          setDownloadPinDialogOpen(false);
        }}
      />
    </>
  );
}
