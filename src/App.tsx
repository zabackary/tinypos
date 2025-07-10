import {
  CircularProgress,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import {
  createM3Theme,
  theme as m3Theme,
  Variant,
} from "mui-material-expressive";
import { memo, useEffect, useMemo, useState } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { setupLogPersistence } from "./store/log";
import { loadPersist, subscribePersist } from "./store/persistStore";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersist().then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setupLogPersistence();
    return subscribePersist();
  }, []);

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
        {loading ? (
          <Stack flexGrow={1} justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <Router />
        )}
        <Stack
          direction="row"
          minHeight="min-content"
          sx={{
            viewTransitionName: "footer",
          }}
        >
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
