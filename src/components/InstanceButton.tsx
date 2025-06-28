import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useInstance, useInstanceStats } from "../store/hooks";

export interface InstanceButtonProps {
  id: string;
  onClick: () => void;
}

export default function InstanceButton({ id, onClick }: InstanceButtonProps) {
  const instance = useInstance(id);
  const instanceStats = useInstanceStats(id);
  return (
    <Card variant="outlined" sx={{ minWidth: 300 }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Typography variant="h4" component="div" textAlign="center" my={2}>
              {instance?.name ?? "?"}
            </Typography>
            <Typography variant="h6" component="div" textAlign="center" my={2}>
              {instanceStats?.items ?? "?"}品 &middot;{" "}
              {instanceStats?.purchases ?? "?"}件
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
