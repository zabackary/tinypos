import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
  type SxProps,
} from "@mui/material";
import { useState } from "react";
import { useInstance, useInstanceStats } from "../store/hooks";
import usePOSStore from "../store/pos";
import { downloadInstancesCsv } from "../store/utils";
import MaterialSymbolIcon from "./MaterialSymbolIcon";
import PinDialog from "./PinDialog";

export interface InstanceButtonProps {
  id: string;
  onClick: () => void;
  sx: SxProps;
}

export default function InstanceButton({
  id,
  onClick,
  sx,
}: InstanceButtonProps) {
  const instance = useInstance(id);
  const instanceStats = useInstanceStats(id);
  const deleteInstance = usePOSStore((store) => store.deleteInstance);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmDeletePinDialogOpen, setConfirmDeletePinDialogOpen] =
    useState(false);

  const [downloadPinDialogOpen, setDownloadPinDialogOpen] = useState(false);

  return (
    <>
      <Card variant="outlined" sx={{ minWidth: 300, ...sx }}>
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                variant="h4"
                component="div"
                textAlign="center"
                my={2}
              >
                {instance?.name ?? "?"}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                textAlign="center"
                my={2}
              >
                {instanceStats?.items ?? "?"}品 &middot;{" "}
                {instanceStats?.purchases ?? "?"}件
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            startIcon={<MaterialSymbolIcon icon="delete" />}
            onClick={() => setConfirmDeleteDialogOpen(true)}
          >
            削除
          </Button>
          <Button
            size="small"
            startIcon={<MaterialSymbolIcon icon="download" />}
            onClick={() => {
              setDownloadPinDialogOpen(true);
            }}
          >
            CSVダウンロード
          </Button>
        </CardActions>
      </Card>
      <PinDialog
        open={confirmDeletePinDialogOpen}
        info="PINを入力して、インスタンスを削除します。"
        closeIfNoPin
        onCancel={() => setConfirmDeletePinDialogOpen(false)}
        onEnter={() => {
          deleteInstance(id);
          setConfirmDeletePinDialogOpen(false);
        }}
      />
      <PinDialog
        open={downloadPinDialogOpen}
        info="CSVをダウンロードするには、PINを入力してください。"
        closeIfNoPin
        onCancel={() => setDownloadPinDialogOpen(false)}
        onEnter={() => {
          downloadInstancesCsv(id);
          setDownloadPinDialogOpen(false);
        }}
      />
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
      >
        <DialogTitle>インスタンスを削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このインスタンスを本当に削除してもよろしいですか？削除後は、元に戻すことができません。このインスタンスの注文・商品は
            <b>すべて削除されます</b>ので、ご注意ください。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteDialogOpen(false)}
            variant="tonal"
          >
            キャンセル
          </Button>
          <Button
            onClick={() => {
              setConfirmDeletePinDialogOpen(true);
              setConfirmDeleteDialogOpen(false);
            }}
            variant="filled"
            sx={{
              color: (theme) => theme.palette.onError.main,
              backgroundColor: (theme) => theme.palette.error.main,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.error.main,
              },
            }}
          >
            「{instance?.name}」を削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
