import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Stack flexGrow={1} justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h4" component="h1" textAlign="center">
        お探しのページは見つかりませんでした。
      </Typography>
      <Button
        onClick={() => {
          navigate("/");
        }}
        variant="filled"
      >
        ホームに戻る
      </Button>
    </Stack>
  );
}
