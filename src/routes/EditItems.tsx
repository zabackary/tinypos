import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MaterialSymbolIcon from "../components/MaterialSymbolIcon";
import NotFound from "../components/NotFound";
import PinDialog from "../components/PinDialog";
import ResponsiveButton from "../components/ResponsiveButton";
import Section from "../components/Section";
import { useInstance, useInstanceItems, useItemStock } from "../store/hooks";
import usePOSStore, { type Item } from "../store/pos";

function ItemItem({
  item,
  onEdit,
  onDelete,
}: {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const stock = useItemStock(item.id);
  return (
    <ListItem
      key={item.id}
      secondaryAction={
        <>
          <ResponsiveButton
            onClick={onEdit}
            startIcon={<MaterialSymbolIcon icon="edit" />}
            variant="outlined"
          >
            編集
          </ResponsiveButton>
          <ResponsiveButton
            onClick={onDelete}
            startIcon={<MaterialSymbolIcon icon="delete" />}
            variant="outlined"
            color="error"
            sx={{ marginLeft: 1 }}
          >
            削除
          </ResponsiveButton>
        </>
      }
      sx={{
        mb: 1,
      }}
    >
      <ListItemText
        primary={item.name}
        secondary={`価格: ${item.price.toLocaleString()}円, 初期在庫: ${item.initialStock.toLocaleString()}個, 現在の在庫: ${stock}`}
      />
    </ListItem>
  );
}

export default function EditItemsRoute() {
  const navigate = useNavigate();
  const params = useParams();
  const instance = useInstance(params.instanceId ?? "");

  const theme = useTheme();

  const items = useInstanceItems(instance?.id ?? "");

  // State for the new item dialog
  // string = id, null = new item, undefined = no dialog open
  const [newItemDialogId, setNewItemDialogId] = useState<
    string | null | undefined
  >(undefined);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemInitialStock, setNewItemInitialStock] = useState(0);

  const updateItem = usePOSStore((store) => store.updateItem);
  const createItem = usePOSStore((store) => store.createItem);
  const deleteItem = usePOSStore((store) => store.deleteItem);

  const [pinDialogOpen, setPinDialogOpen] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteConfirmationItemId, setDeleteConfirmationItemId] = useState<
    string | null
  >(null);

  if (!instance) return <NotFound />;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar sx={{ padding: "0 !important" }}>
          <ResponsiveButton
            variant="tonal"
            startIcon={<MaterialSymbolIcon icon="arrow_back" fill />}
            onClick={() => {
              navigate(-1);
            }}
          >
            保存
          </ResponsiveButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            「{instance.name}」を編集中
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        direction="column"
        gap={2}
        flexGrow={1}
        alignItems="center"
        overflow="auto"
      >
        <Section direction={"column"} flexGrow={1} width="100%" overflow="auto">
          {items.length > 0 ? (
            <List>
              {items.map((item) => (
                <ItemItem
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setNewItemDialogId(item.id);
                    setNewItemName(item.name);
                    setNewItemPrice(item.price);
                    setNewItemInitialStock(item.initialStock);
                  }}
                  onDelete={() => {
                    setDeleteConfirmationItemId(item.id);
                    setDeleteConfirmationOpen(true);
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
                <MaterialSymbolIcon icon="inventory_2" size={64} />
              </Box>
              <Typography variant="body1" textAlign="center">
                商品がありません
              </Typography>
            </Stack>
          )}
        </Section>
        <Button
          variant="filled"
          size="large"
          onClick={() => {
            setNewItemDialogId(null);
            setNewItemName("");
            setNewItemPrice(0);
            setNewItemInitialStock(0);
          }}
        >
          商品を追加
        </Button>
      </Stack>
      <Dialog
        open={newItemDialogId !== undefined}
        onClose={() => setNewItemDialogId(undefined)}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (e: React.FormEvent) => {
              e.preventDefault();
              if (newItemDialogId === null) {
                createItem(
                  instance.id,
                  newItemName,
                  newItemInitialStock,
                  newItemPrice
                );
              } else if (newItemDialogId) {
                // Update existing item
                updateItem(
                  newItemDialogId,
                  newItemName,
                  newItemInitialStock,
                  newItemPrice
                );
              }
              setNewItemDialogId(undefined);
            },
          },
        }}
        disableRestoreFocus
      >
        <DialogTitle>
          {newItemDialogId === null ? "新しい商品を追加" : "商品を編集"}
        </DialogTitle>
        <Box sx={{ padding: 2 }}>
          <Stack direction="column" gap={2}>
            <TextField
              label="商品名"
              variant="outlined"
              fullWidth
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
            />
            <TextField
              label="価格"
              variant="outlined"
              type="number"
              fullWidth
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
            />
            <TextField
              label="初期在庫"
              variant="outlined"
              type="number"
              fullWidth
              value={newItemInitialStock}
              onChange={(e) => setNewItemInitialStock(Number(e.target.value))}
            />
          </Stack>
        </Box>
        <DialogActions>
          <Button variant="tonal" onClick={() => setNewItemDialogId(undefined)}>
            キャンセル
          </Button>
          <Button
            variant="filled"
            type="submit"
            disabled={
              !newItemName || newItemPrice <= 0 || newItemInitialStock <= 0
            }
          >
            {newItemDialogId === null ? "追加" : "保存"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>商品を削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本当にこの商品を削除しますか？削除すると元に戻せませんが、この商品がある注文は削除されません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="tonal"
            onClick={() => {
              setDeleteConfirmationOpen(false);
              setDeleteConfirmationItemId(null);
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="filled"
            color="error"
            onClick={() => {
              if (deleteConfirmationItemId) {
                deleteItem(deleteConfirmationItemId);
              }
              setDeleteConfirmationOpen(false);
              setDeleteConfirmationItemId(null);
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
      <PinDialog
        open={pinDialogOpen}
        closeIfNoPin
        blur
        onCancel={() => {
          navigate("..");
        }}
        onEnter={() => {
          setPinDialogOpen(false);
        }}
      />
    </>
  );
}
