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
  useMediaQuery,
  type SxProps,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInstance, useInstanceStats } from "../store/hooks";
import usePOSStore from "../store/pos";
import { downloadInstanceCsv, exportInstance } from "../store/utils";
import { formatCount } from "../utils/format";
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
  const [exportPinDialogOpen, setExportPinDialogOpen] = useState(false);

  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const itemsDisplay =
    instanceStats && instanceStats.items != null
      ? formatCount(instanceStats.items)
      : "?";
  const purchasesDisplay =
    instanceStats && instanceStats.purchases != null
      ? formatCount(instanceStats.purchases)
      : "?";

  return (
    <>
      <Card variant="outlined" sx={{ minWidth: 330, ...sx }}>
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
                {t("instanceButton.statsSummary", {
                  items: itemsDisplay,
                  purchases: purchasesDisplay,
                })}
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            flexDirection: smallScreen ? "column" : undefined,
          }}
        >
          <Button
            size="small"
            startIcon={<MaterialSymbolIcon icon="delete" />}
            onClick={() => setConfirmDeleteDialogOpen(true)}
            fullWidth={smallScreen}
          >
            {t("instanceButton.delete")}
          </Button>
          <Button
            size="small"
            startIcon={<MaterialSymbolIcon icon="download" />}
            onClick={() => {
              setDownloadPinDialogOpen(true);
            }}
            fullWidth={smallScreen}
          >
            {t("instanceButton.downloadCsv")}
          </Button>
          <Button
            size="small"
            startIcon={<MaterialSymbolIcon icon="import_export" />}
            onClick={() => {
              setExportPinDialogOpen(true);
            }}
            fullWidth={smallScreen}
          >
            {t("instanceButton.export")}
          </Button>
        </CardActions>
      </Card>
      <PinDialog
        open={confirmDeletePinDialogOpen}
        info={t("instanceButton.pinInfoDelete")}
        closeIfNoPin
        onCancel={() => setConfirmDeletePinDialogOpen(false)}
        onEnter={() => {
          deleteInstance(id);
          setConfirmDeletePinDialogOpen(false);
        }}
      />
      <PinDialog
        open={downloadPinDialogOpen}
        info={t("instanceButton.pinInfoDownload")}
        closeIfNoPin
        onCancel={() => setDownloadPinDialogOpen(false)}
        actionLabel={t("instanceButton.downloadCsv")}
        onEnter={() => {
          downloadInstanceCsv(id);
          setDownloadPinDialogOpen(false);
        }}
      />
      <PinDialog
        open={exportPinDialogOpen}
        info={t("instanceButton.pinInfoExport")}
        actionLabel={t("instanceButton.export")}
        closeIfNoPin
        onCancel={() => setExportPinDialogOpen(false)}
        onEnter={() => {
          exportInstance(id);
          setExportPinDialogOpen(false);
        }}
      />
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
      >
        <DialogTitle>{t("instanceButton.confirmDeleteTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("instanceButton.confirmDeleteBody")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteDialogOpen(false)}
            variant="tonal"
          >
            {t("common.cancel")}
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
            {t("instanceButton.confirmDeleteAction", { name: instance?.name })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
