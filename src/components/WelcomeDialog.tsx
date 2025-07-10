import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";

export default function WelcomeDialog({
  headerIsHelp = false,
  open,
  onClose,
}: {
  headerIsHelp?: boolean;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{headerIsHelp ? "ヘルプ" : "ようこそ"}</DialogTitle>
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
        <DialogContentText sx={{ mt: 1 }}>
          まずは、インスタンスを作成してみてください。インスタンスは、お店のことです。インスタンスを作成すると、注文ページが開きます。そこから、商品を編集したり、履歴を見たりできます。
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          注意：このアプリはウェブサイトなので、インターネットがない場合は普通に使えませんが、ブラウザ&#xff08;例&#xff1a;Chrome&#xff09;のインストールボタンを押すとオフラインでも使えるようになります。詳しくは
          <Link
            href="https://web.dev/learn/pwa/installation?hl=ja#ios_and_ipados_installation:~:text=%E3%83%9B%E3%83%BC%E3%83%A0%E7%94%BB%E9%9D%A2%E3%81%AB%E3%82%A2%E3%83%97%E3%83%AA,%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82"
            target="_blank"
          >
            こちら
          </Link>
          をご覧ください。
        </DialogContentText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            borderRadius: 3,
            p: 1,
            mt: 2,
            bgcolor: (theme) => theme.palette.surfaceContainerLowest.main,
          }}
        >
          このアプリをご利用いただき、ありがとうございます。GitHubのスターを押してくれたり、使用中の写真をメール&#xff08;このウェブサイトのURLの「.github.io」の前の部分
          + "@gmail.com"&#xff09;で送ったりできれば嬉しいです。💕
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            borderRadius: 3,
            p: 1,
            mt: 2,
            bgcolor: (theme) => theme.palette.surfaceContainerLowest.main,
          }}
        >
          イエスは答えられた。「まことに、まことに、あなたに言います。人は、新しく生まれなければ、神の国を見ることはできません。」(
          ヨハネの福音書 3:3 JDB )<br />
          この恵みのゆえに、あなたがたは信仰によって救われたのです。それはあなたがたから出たことではなく、神の賜物です。行いによるのではありません。だれも誇ることのないためです。(
          エペソ人への手紙 2:8-9 JDB )
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="filled" onClick={onClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
