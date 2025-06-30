import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from "@mui/material";
import { useState } from "react";
import usePOSStore from "../store/pos";

export default function WelcomeDialog({}: {}) {
  const setHasSeenWelcome = usePOSStore((store) => store.setHasSeenWelcome);

  const [open, setOpen] = useState(() => {
    const hasSeenWelcome = usePOSStore.getState().hasSeenWelcome;
    return !hasSeenWelcome;
  });

  const handleClose = () => {
    setHasSeenWelcome(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>ようこそ</DialogTitle>
      <DialogContent>
        <DialogContentText>
          このアプリは、「tinyPOS・小さなPOSシステム」です。「小さな」という意味は、シンプルな使い方や現金のみご利用いただけることを指します。
          このアプリを作った人はPOSシステムに関する法律を全然知らないので、ご注意ください。または、日本語がまだまだ良くないので、間違えがあるかもしれません&#xff08;自動的な翻訳ウェブサイトも使います&#xff09;。間違えや質問がありましたら、
          <Link
            href="https://github.com/zabackary/tinypos/issues/new"
            target="_blank"
          >
            このプロジェクトのGitHubリポジトリにIssueを作成してください
          </Link>
          。
        </DialogContentText>
        <DialogContentText>
          まずは、インスタンスを作成してみてください。インスタンスは、お店のことです。インスタンスを作成すると、注文ページが開きます。そこから、商品を編集したり、履歴を見たりできます。
        </DialogContentText>
        <DialogContentText>
          注意：このアプリはウェブサイトなので、インターネットがない場合は普通に使えませんが、ブラウザ&#xff08;例&#xff1a;Chrome&#xff09;のインストールボタンを押すとオフラインでも使えるようになります。詳しくは
          <Link
            href="https://web.dev/learn/pwa/installation?hl=ja#ios_and_ipados_installation:~:text=%E3%83%9B%E3%83%BC%E3%83%A0%E7%94%BB%E9%9D%A2%E3%81%AB%E3%82%A2%E3%83%97%E3%83%AA,%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82"
            target="_blank"
          >
            こちら
          </Link>
          をご覧ください。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="filled" onClick={handleClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
