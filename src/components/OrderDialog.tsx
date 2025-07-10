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
import { useItemInfos, usePurchase } from "../store/hooks";

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
                secondary={`${item.quantity}個`}
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
            secondaryAction={<Typography>{purchase.total}円</Typography>}
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              mb: 1,
              p: 2,
            }}
          >
            <ListItemText primary="合計" />
          </ListItem>
          <ListItem
            secondaryAction={<Typography>{purchase.paid}円</Typography>}
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              mb: 1,
              p: 2,
            }}
          >
            <ListItemText primary="お預かり金" />
          </ListItem>
          <ListItem
            secondaryAction={
              <Typography>{purchase.paid - purchase.total}円</Typography>
            }
            sx={{
              p: 2,
            }}
          >
            <ListItemText primary="お釣り" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onDelete}>
          削除
        </Button>
        <Button variant="filled" onClick={onClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
