import {
  Button,
  Tooltip,
  useMediaQuery,
  type ButtonProps,
} from "@mui/material";

export interface ResponsiveButtonProps extends ButtonProps {
  alwaysCollapse?: boolean;
  collapsedVariant?: ButtonProps["variant"];
}

export default function ResponsiveButton({
  children,
  startIcon,
  sx,
  alwaysCollapse = false,
  collapsedVariant,
  ...props
}: ResponsiveButtonProps) {
  const resolvedCollapsedVariant = collapsedVariant ?? props.variant;
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return smallScreen || alwaysCollapse ? (
    <Tooltip title={children}>
      <Button
        {...props}
        sx={{
          px: 0,
          minWidth: "56px",
          ...sx,
        }}
        variant={resolvedCollapsedVariant}
        centerRipple={smallScreen}
      >
        {startIcon}
      </Button>
    </Tooltip>
  ) : (
    <Button {...props} startIcon={startIcon} sx={sx}>
      {children}
    </Button>
  );
}
