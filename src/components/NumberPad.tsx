import {
  Box,
  Button,
  ButtonBase,
  useTheme,
  type PaletteColor,
  type SxProps,
} from "@mui/material";
import { type ReactNode } from "react";
import MaterialSymbolIcon from "./MaterialSymbolIcon";

function NumberButton({
  color,
  content,
  width = "82px",
  sx = {},
  onClick,
}: {
  color: PaletteColor;
  content: ReactNode;
  width?: string;
  sx?: SxProps;
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        fontSize: 24,
        width,
        height: "82px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: color.main,
        color: color.contrastText,
        borderRadius: 7,
        transition: theme.transitions.create(["border-radius"]),
        "--mui-button-base-focus-ring-radius": `${7 * 4}px`,
        "&:active": {
          borderRadius: 4,
          "--mui-button-base-focus-ring-radius": `${4 * 4}px`,
        },
        ...sx,
      }}
    >
      {content}
    </ButtonBase>
  );
}

export interface NumberPadProps {
  onNumberClick: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  sx?: SxProps;
}

export default function NumberPad({
  onNumberClick,
  onClear,
  onSubmit,
  disabled,
  sx,
}: NumberPadProps) {
  const theme = useTheme();
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gap="6px"
      alignItems={"center"}
      justifyItems={"center"}
      alignSelf={"center"}
      sx={sx}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <NumberButton
          key={number}
          color={theme.palette.secondary}
          content={String(number)}
          onClick={() => onNumberClick(String(number))}
        />
      ))}
      <NumberButton
        color={theme.palette.tertiary}
        content={"00"}
        onClick={() => onNumberClick("00")}
      />
      <NumberButton
        color={theme.palette.secondary}
        content={"0"}
        onClick={() => onNumberClick("0")}
      />
      <NumberButton
        color={theme.palette.tertiary}
        content={<MaterialSymbolIcon icon="backspace" size={28} />}
        onClick={() => onClear()}
      />
      <Button
        variant="filled"
        fullWidth
        size="large"
        sx={{
          gridColumn: "1 / -1",
          height: "82px",
          borderRadius: 10.25,
        }}
        disabled={disabled}
        onClick={() => onSubmit()}
      >
        終了
      </Button>
    </Box>
  );
}
