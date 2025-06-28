import { Box, keyframes, Stack, Typography, useTheme } from "@mui/material";
import MaterialSymbolIcon from "./MaterialSymbolIcon";

export interface PaymentColumnProps {
  label: string;
  amount: string;
  error?: boolean;
  isTyping?: boolean;
  caption?: string;
}

export default function PaymentColumn({
  label,
  amount,
  caption,
  error = false,
  isTyping = false,
}: PaymentColumnProps) {
  const theme = useTheme();
  return (
    <Stack direction={"column"} gap={1}>
      <Typography variant="h6" component="h2" textAlign={"center"}>
        {label}
      </Typography>
      <Box
        sx={{
          borderRadius: 4,
          backgroundColor: !error
            ? theme.palette.primaryContainer.main
            : theme.palette.errorContainer.main,
          color: !error
            ? theme.palette.onPrimaryContainer.main
            : theme.palette.onErrorContainer.main,
          animation: isTyping
            ? `${keyframes`
              from {
                background-color: ${theme.palette.primaryContainer.main};
              }
              to {
                background-color: ${theme.palette.secondaryContainer.main};
              }
              `} 1s ${theme.transitions.easing.easeInOut} infinite alternate`
            : "none",
          padding: 2,
          textAlign: "center",
          minWidth: 140,
        }}
      >
        <Typography
          variant="h4"
          sx={{ padding: 1 }}
          component="span"
          textAlign={"center"}
        >
          {!error ? (
            amount.toLocaleString()
          ) : (
            <MaterialSymbolIcon icon="error" />
          )}
          {isTyping ? (
            <Box
              component="span"
              sx={{
                animation: `${keyframes`
                0% { opacity: 1; }
                30% { opacity: 1; }
                50% { opacity: 0; }
                80% { opacity: 0; }
                100% { opacity: 1; }
              `} 1s ${theme.transitions.easing.easeInOut} infinite`,
                display: "inline-block",
                marginLeft: 0.3,
                backgroundColor: "currentcolor",
                width: "2px",
                height: "1em",
                transform: "translateY(0.1em)",
              }}
            />
          ) : null}
        </Typography>
      </Box>
      {caption !== null && caption !== "" ? (
        <Typography
          variant="body1"
          color={theme.palette.onSurfaceVariant.main}
          textAlign={"center"}
        >
          {caption ?? ""}
        </Typography>
      ) : null}
    </Stack>
  );
}
