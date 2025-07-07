import {
  Button,
  ButtonGroup,
  Collapse,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialSymbolIcon from "../MaterialSymbolIcon";

interface ErrorPageProps {
  errorText: string;
  debuggingDetails: string;
  traceback: string;
}

export default function ErrorPage({
  errorText,
  traceback,
  debuggingDetails,
}: ErrorPageProps) {
  const [expanded, setExpanded] = useState(false);
  const [debuggingDetailsTooltip, setDebuggingDetailsTooltip] =
    useState("コピーする");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCopyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(debuggingDetails);
      setDebuggingDetailsTooltip("クリップボードにコピーしました。");
    } catch (e) {
      setDebuggingDetailsTooltip("クリップボードへのコピーに失敗しました。");
    }
  };

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  return (
    <>
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
        gap={2}
        margin="auto"
        maxWidth={500}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          エラーが発生しました。
        </Typography>
        <Typography variant="h6" component="div" textAlign="center">
          意外とエラーが発生しました。GitHubにIssueを作成してください。下のクリップボードボタンを押してエラーをコピーしてご利用ください。
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          <i>{errorText}</i>
        </Typography>
        <Stack direction="row" gap={1} alignItems="center">
          <Button
            onClick={() => {
              navigate("/");
            }}
            variant="filled"
          >
            ホームに戻る
          </Button>
          <ButtonGroup variant="tonal">
            <Tooltip title={debuggingDetailsTooltip}>
              <Button
                onClick={() => {
                  void handleCopyButtonClick();
                }}
                sx={{
                  borderTopRightRadius: "16px !important",
                  borderBottomRightRadius: "16px !important",
                  "&:active": {
                    borderTopLeftRadius: "50px !important",
                    borderBottomLeftRadius: "50px !important",
                    borderTopRightRadius: "8px !important",
                    borderBottomRightRadius: "8px !important",
                  },
                }}
              >
                コピーする
              </Button>
            </Tooltip>
            <Tooltip title="もっと見る">
              <Button
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="もっと見る"
                sx={{
                  ml: 0.5,
                  borderTopLeftRadius: expanded
                    ? "50px !important"
                    : "16px !important",
                  borderBottomLeftRadius: expanded
                    ? "50px !important"
                    : "16px !important",
                  "&:active": {
                    borderTopLeftRadius: expanded
                      ? "32px !important"
                      : "32px !important",
                    borderBottomLeftRadius: expanded
                      ? "32px !important"
                      : "32px !important",
                    borderTopRightRadius: "50px !important",
                    borderBottomRightRadius: "50px !important",
                  },
                  px: 2,
                }}
                ref={dropdownRef}
              >
                <MaterialSymbolIcon
                  icon="arrow_drop_down"
                  sx={{
                    transform: expanded ? "rotate(180deg)" : "none",
                    transition: (theme) =>
                      theme.transitions.create("transform"),
                  }}
                />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Stack>
        <Popover
          anchorEl={dropdownRef?.current}
          anchorReference="anchorEl"
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          open={expanded}
          onClose={() => {
            setExpanded(false);
          }}
        >
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              overflow: "auto",
              maxWidth: 300,
              maxHeight: 300,
              p: 1,
            }}
          >
            {traceback}
          </Typography>
        </Popover>
        <Collapse in={expanded} timeout="auto"></Collapse>
      </Stack>
    </>
  );
}
