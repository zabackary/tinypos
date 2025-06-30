import { CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import {
  createM3Theme,
  theme as m3Theme,
  Variant,
} from "mui-material-expressive";
import { memo, useMemo } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";

const router = createHashRouter(routes);
const Router = memo(() => <RouterProvider router={router} />);

export default function App() {
  const theme = useMemo(
    () =>
      createM3Theme({
        baseColorHex: "#efa0ff",
        themeMode: m3Theme.ThemeMode.LIGHT,
        variant: Variant.EXPRESSIVE,
      }),
    []
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Stack
        height="100%"
        overflow="auto"
        bgcolor={theme.palette.surface.main}
        p={2}
        gap={2}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Router />
        <Stack direction="row" minHeight="min-content">
          <Typography
            flexGrow={1}
            color={theme.palette.onSurfaceVariant.main}
            variant="caption"
          >
            tinyPOS &middot; v{APP_VERSION}
          </Typography>
          <Typography
            color={theme.palette.onSurfaceVariant.main}
            variant="caption"
          >
            made with ✝ and 💖 in japan &middot; github.com/zabackary
          </Typography>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
