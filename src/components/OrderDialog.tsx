import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useItemInfos, usePurchase } from "../store/hooks";
import { formatCount, formatCurrency } from "../utils/format";

export default function OrderDialog({
  purchaseId,
  open,
  onDelete,
  onClose,
}: {
  purchaseId: string;
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
}) {
  const purchase = usePurchase(purchaseId);
  const items = useItemInfos(purchase?.instanceId ?? "", true);
  const { t } = useTranslation();

  if (!purchase) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{purchase.date}</DialogTitle>
      <DialogContent>
        <List>
          {purchase.items.map((item) => (
            <ListItem key={item.itemId} disableGutters>
              <ListItemText
                primary={items.find((i) => i.id === item.itemId)?.name}
                secondary={t("orderDialog.itemQuantity", {
                  value: formatCount(item.quantity),
                })}
              />
            </ListItem>
          ))}
        </List>
        <List
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
          disablePadding
        >
          <ListItem
            secondaryAction={
              <Typography>
                {t("orderDialog.totalValue", {
                  value: formatCurrency(purchase.total),
                })}
              </Typography>
            }
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              mb: 1,
              p: 2,
            }}
          >
            <ListItemText primary={t("orderDialog.total")} />
          </ListItem>
          <ListItem
            secondaryAction={
              <Typography>
                {t("orderDialog.paidValue", {
                  value: formatCurrency(purchase.paid),
                })}
              </Typography>
            }
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              mb: 1,
              p: 2,
            }}
          >
            <ListItemText primary={t("orderDialog.paid")} />
          </ListItem>
          <ListItem
            secondaryAction={
              <Typography>
                {t("orderDialog.changeValue", {
                  value: formatCurrency(purchase.paid - purchase.total),
                })}
              </Typography>
            }
            sx={{
              p: 2,
            }}
          >
            <ListItemText primary={t("orderDialog.change")} />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onDelete}>
          {t("orderDialog.delete")}
        </Button>
        <Button variant="filled" onClick={onClose}>
          {t("orderDialog.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
