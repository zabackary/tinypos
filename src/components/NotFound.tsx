import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Section from "./Section";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Section flexGrow={1} justifyContent="center" alignItems="center" gap={2}>
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
    </Section>
  );
}
