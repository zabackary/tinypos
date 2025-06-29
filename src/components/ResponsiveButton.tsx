import { Button, useMediaQuery, type ButtonProps } from "@mui/material";

export default function ResponsiveButton({
  children,
  startIcon,
  ...props
}: ButtonProps) {
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return smallScreen ? (
    <Button {...props}>{startIcon}</Button>
  ) : (
    <Button {...props} startIcon={startIcon}>
      {children}
    </Button>
  );
}
