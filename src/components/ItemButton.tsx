import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
  type SxProps,
} from "@mui/material";
import { useViewTransitionState } from "react-router-dom";
import { useItem, useItemStock } from "../store/hooks";
import { formatCount, formatCurrency } from "../utils/format";

export interface ItemButtonProps {
  id: string;
  selectedCount: number;
  onClick: () => void;
  sx?: SxProps;
}

export default function ItemButton({
  id,
  selectedCount,
  onClick,
  sx = {},
}: ItemButtonProps) {
  const item = useItem(id);
  const stock = useItemStock(id);
  const theme = useTheme();
  const isTransitioningEditItems = useViewTransitionState(
    `/${item?.instanceId}/edit`
  );

  if (!item || stock === undefined) return null;

  const disabled = stock - selectedCount <= 0;

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor:
          selectedCount > 0 ? theme.palette.surfaceContainerHighest.main : null,
        opacity: disabled ? 0.5 : 1,
        transition: theme.transitions.create(["background-color", "opacity"]),
        ...sx,
      }}
    >
      <CardActionArea onClick={onClick} disabled={disabled}>
        <CardContent>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography
              variant="h4"
              component="div"
              textAlign="center"
              my={2}
              sx={{
                viewTransitionName: isTransitioningEditItems
                  ? `instance-${item.instanceId}-item-${item.id}-name`
                  : "none",
              }}
            >
              {item.name}
            </Typography>
            <Box
              bgcolor={
                selectedCount > 0
                  ? theme.palette.primary.main
                  : theme.palette.surfaceContainerHighest.main
              }
              color={
                selectedCount > 0
                  ? theme.palette.onPrimary.main
                  : theme.palette.onSurface.main
              }
              sx={{
                transition: theme.transitions.create([
                  "background-color",
                  "color",
                  "border-radius",
                ]),
              }}
              component="span"
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              fontSize={18}
              height={36}
              width={36}
              ml={1}
              borderRadius={selectedCount > 0 ? "12px" : "18px"}
            >
              {selectedCount}
            </Box>
          </Stack>
          <Typography variant="body2" textAlign="center">
            <Box
              component="span"
              sx={{
                viewTransitionName: isTransitioningEditItems
                  ? `instance-${item.instanceId}-item-${item.id}-price`
                  : "none",
              }}
            >
              {formatCurrency(item.price)}
            </Box>{" "}
            &middot;{" "}
            <Box
              component="span"
              sx={{
                viewTransitionName: isTransitioningEditItems
                  ? `instance-${item.instanceId}-item-${item.id}-stock`
                  : "none",
              }}
            >
              {formatCount(stock)}
            </Box>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
