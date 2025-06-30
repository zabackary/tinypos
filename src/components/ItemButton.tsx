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
import { useItem, useItemStock } from "../store/hooks";

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
            <Typography variant="h4" component="div" textAlign="center" my={2}>
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
            {item.price}円 &middot; {stock}個
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
