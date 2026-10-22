import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInstance, useInstances } from "../store/hooks";
import {
  applyMerge,
  conflictKey,
  hasChanges,
  MergeError,
  parseMergeFile,
  planMerge,
  type MergeConflict,
  type MergePlan,
  type MergeResolution,
} from "../store/merge";
import { formatCurrency } from "../utils/format";

/** Opens a file picker; resolves to null if the user cancels. */
function pickFileText(accept: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      file.text().then(resolve, reject);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

function InstanceName({ id }: { id: string }) {
  const instance = useInstance(id);
  return <>{instance?.name ?? "?"}</>;
}

/** Lists the instances so the user can choose which one to merge into. */
export function MergeInstancePicker({
  open,
  onCancel,
  onPick,
}: {
  open: boolean;
  onCancel: () => void;
  onPick: (instanceId: string) => void;
}) {
  const { t } = useTranslation();
  const instances = useInstances();
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{t("merge.pickInstanceTitle")}</DialogTitle>
      <DialogContent>
        <List>
          {instances.map((id) => (
            <ListItem key={id} disablePadding>
              <ListItemButton onClick={() => onPick(id)}>
                <ListItemText primary={<InstanceName id={id} />} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="tonal" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConflictDialog({
  conflict,
  remaining,
  onResolve,
  onCancel,
}: {
  conflict: MergeConflict;
  /** Unresolved conflicts of this kind, including this one. */
  remaining: number;
  onResolve: (resolution: MergeResolution, applyToAll: boolean) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [applyToAll, setApplyToAll] = useState(false);

  let title: string;
  let body: string;
  let mine: string;
  let theirs: string;
  switch (conflict.kind) {
    case "itemFields": {
      const { local, remote } = conflict;
      title = t("merge.itemFieldsTitle");
      body = t("merge.itemFieldsBody", { name: local.name });
      mine = `${local.name} · ${formatCurrency(local.price)}`;
      theirs = `${remote.name} · ${formatCurrency(remote.price)}`;
      break;
    }
    case "itemDeleted": {
      const { local, remote } = conflict;
      title = t("merge.itemDeletedTitle");
      body = t("merge.itemDeletedBody", { name: local.name });
      mine = t(local.deleted ? "merge.stateDeleted" : "merge.stateActive");
      theirs = t(remote.deleted ? "merge.stateDeleted" : "merge.stateActive");
      break;
    }
    case "purchaseDeleted": {
      const { local, remote } = conflict;
      title = t("merge.purchaseDeletedTitle");
      body = t("merge.purchaseDeletedBody", { date: local.date });
      mine = t(local.deleted ? "merge.stateDeleted" : "merge.stateActive");
      theirs = t(remote.deleted ? "merge.stateDeleted" : "merge.stateActive");
      break;
    }
  }

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
        <Stack gap={1} mt={2}>
          <Typography variant="body2">
            <b>{t("merge.mine")}:</b> {mine}
          </Typography>
          <Typography variant="body2">
            <b>{t("merge.theirs")}:</b> {theirs}
          </Typography>
        </Stack>
        {remaining > 1 && (
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
              />
            }
            label={t("merge.applyToAll", { count: remaining - 1 })}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button variant="tonal" onClick={() => onResolve("local", applyToAll)}>
          {t("merge.keepMine")}
        </Button>
        <Button
          variant="filled"
          onClick={() => onResolve("remote", applyToAll)}
        >
          {t("merge.useTheirs")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Drives the whole merge: pick a file, summarise what it changes, resolve
 * each conflict, apply. Mount it to start; it calls `onFinished` when done
 * or cancelled (`merged` says whether anything was applied).
 */
export default function MergeFlow({
  instanceId,
  onFinished,
}: {
  instanceId: string;
  onFinished: (merged: boolean) => void;
}) {
  const { t } = useTranslation();
  const instance = useInstance(instanceId);

  const [plan, setPlan] = useState<MergePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolutions, setResolutions] = useState<
    Record<string, MergeResolution>
  >({});
  // Whether the user has confirmed the summary; conflicts come after.
  const [confirmed, setConfirmed] = useState(false);
  // Whether the user accepted merging a file from a different instance.
  const [mismatchAccepted, setMismatchAccepted] = useState(false);
  const [done, setDone] = useState(false);

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    pickFileText(".json")
      .then((text) => {
        if (text === null) return onFinished(false);
        setPlan(planMerge(parseMergeFile(text), instanceId));
      })
      .catch((e) => {
        console.error("Failed to merge:", e);
        setError(
          e instanceof MergeError ? e.humanMessage : t("store.consoleCheck"),
        );
      });
  }, [instanceId, onFinished, t]);

  const finish = (all: Record<string, MergeResolution>) => {
    if (!plan) return;
    applyMerge(plan, all);
    setDone(true);
  };

  if (error !== null) {
    return (
      <Dialog open onClose={() => onFinished(false)}>
        <DialogTitle>{t("merge.errorTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="filled" onClick={() => onFinished(false)}>
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  if (!plan) return null;

  if (done) {
    return (
      <Dialog open onClose={() => onFinished(true)}>
        <DialogTitle>{t("merge.doneTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("merge.doneBody", {
              orders: plan.newPurchases.length,
              items: plan.newItems.length,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="filled" onClick={() => onFinished(true)}>
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (confirmed) {
    const pending = plan.conflicts.filter(
      (c) => resolutions[conflictKey(c)] === undefined,
    );
    const current = pending[0];
    return (
      <ConflictDialog
        key={conflictKey(current)}
        conflict={current}
        remaining={pending.filter((c) => c.kind === current.kind).length}
        onCancel={() => onFinished(false)}
        onResolve={(resolution, applyToAll) => {
          const next = { ...resolutions };
          for (const c of applyToAll
            ? pending.filter((p) => p.kind === current.kind)
            : [current]) {
            next[conflictKey(c)] = resolution;
          }
          setResolutions(next);
          if (pending.every((c) => next[conflictKey(c)] !== undefined)) {
            finish(next);
          }
        }}
      />
    );
  }

  if (plan.instanceMismatch && !mismatchAccepted) {
    return (
      <Dialog open onClose={() => onFinished(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t("merge.mismatchTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("merge.mismatchBody", {
              fileName: plan.file.instance.name,
              name: instance?.name ?? "?",
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="tonal" onClick={() => onFinished(false)}>
            {t("common.cancel")}
          </Button>
          <Button variant="filled" onClick={() => setMismatchAccepted(true)}>
            {t("merge.mismatchContinue")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const changes = hasChanges(plan);
  const newOrders = plan.newPurchases.length;
  return (
    <Dialog open onClose={() => onFinished(false)} fullWidth maxWidth="xs">
      <DialogTitle>{t("merge.summaryTitle")}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          {plan.alreadyMerged && (
            <DialogContentText>
              {!changes
                ? t("merge.alreadyMergedNone")
                : newOrders > 0
                  ? t("merge.alreadyMergedOrders", { count: newOrders })
                  : t("merge.alreadyMergedOther")}
            </DialogContentText>
          )}
          {!plan.alreadyMerged && !changes && (
            <DialogContentText>{t("merge.noChanges")}</DialogContentText>
          )}
          {changes && (
            <DialogContentText>
              {t("merge.summaryBody", {
                count: newOrders,
                name: instance?.name ?? "?",
              })}
            </DialogContentText>
          )}
          {plan.newItems.length > 0 && (
            <div>
              <Typography variant="subtitle2">
                {t("merge.newItems", { count: plan.newItems.length })}
              </Typography>
              <List dense disablePadding>
                {plan.newItems.map((item) => (
                  <ListItem key={item.id} disableGutters>
                    <ListItemText
                      primary={item.name}
                      secondary={formatCurrency(item.price)}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {plan.conflicts.length > 0 && (
            <DialogContentText>
              {t("merge.conflictsNote", { count: plan.conflicts.length })}
            </DialogContentText>
          )}
          {plan.inconsistentPurchaseIds.length > 0 && (
            <Alert severity="warning">
              {t("merge.priceWarning", {
                count: plan.inconsistentPurchaseIds.length,
              })}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="tonal" onClick={() => onFinished(false)}>
          {changes ? t("common.cancel") : t("common.close")}
        </Button>
        {changes && (
          <Button
            variant="filled"
            onClick={() =>
              plan.conflicts.length > 0 ? setConfirmed(true) : finish({})
            }
          >
            {t("merge.merge")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
