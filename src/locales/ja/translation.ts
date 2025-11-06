const translation = {
  app: {
    title: "tinyPOS",
    footerVersionPrefix: "tinyPOS · v{{version}}",
    footerMadeWith: "made with ✝ and 💖 in japan · github.com/zabackary",
  },
  common: {
    cancel: "キャンセル",
    ok: "OK",
    close: "閉じる",
  },
  welcome: {
    title: "ようこそ",
    helpTitle: "ヘルプ",
    p1: "このアプリは、『tinyPOS・小さなPOSシステム』です。『小さな』という意味は、シンプルな使い方や現金のみご利用いただけることを指します。",
    p1b: "このアプリを作った人はPOSシステムに関する法律を全然知らないので、ご注意ください。または、日本語がまだまだ良くないので、間違えがあるかもしれません（自動的な翻訳ウェブサイトも使います）。間違えや質問がありましたら、",
    reportIssueLinkText:
      "このプロジェクトのGitHubリポジトリにIssueを作成してください",
    p2: "まずは、インスタンスを作成してみてください。インスタンスは、お店のことです。インスタンスを作成すると、注文ページが開きます。そこから、商品を編集したり、履歴を見たりできます。",
    p3: "注意：このアプリはウェブサイトなので、インターネットがない場合は普通に使えませんが、ブラウザ（例：Chrome）のインストールボタンを押すとオフラインでも使えるようになります。詳しくは、",
    p3LinkText: "こちら",
    thanks:
      'このアプリをご利用いただき、ありがとうございます。GitHubのスターを押してくれたり、使用中の写真をメール（このウェブサイトのURLの「.github.io」の前の部分 + "@gmail.com"）で送ったりできれば嬉しいです。💕',
    bible1:
      "イエスは答えられた。『まことに、まことに、あなたに言います。人は、新しく生まれなければ、神の国を見ることはできません。』(ヨハネの福音書 3:3 JDB)",
    bible2:
      "この恵みのゆえに、あなたがたは信仰によって救われたのです。それはあなたがたから出たことではなく、神の賜物です。行いによるのではありません。だれも誇ることのないためです。(エペソ人への手紙 2:8-9 JDB)",
    downloadLogs: "ログをDL",
  },
  notFound: {
    title: "お探しのページは見つかりませんでした。",
    backHome: "ホームに戻る",
  },
  home: {
    resetAll: "すべてをリセット",
    setPin: "ピンを設定",
    changePin: "ピンを変更",
    help: "ヘルプ",
    persistWarning:
      "現在、ストレージが足りなければ保存することができない場合がございますのでご注意ください。Chromeでは、インストール後に保存することができるようになります。",
    persistWarningDetail:
      "ストレージが十分なら、このアラートは無視しても問題ありません。",
    unsupportedFeaturesTitle:
      "ご使用中のブラウザは必要な機能をサポートしていません。一部の機能が正しく動作しない場合があります。",
    unsupportedFeaturesDetail: "サポートされていない機能: {{features}}",
    selectInstanceTitle: "インスタンスをお選びください",
    noInstances: "インスタンスがありません",
    createInstance: "インスタンスを作成",
    importTooltip: "もっと見る",
    importInstance: "インスタンスをインポート",
    resetDialogTitle:
      "すべてのデータ（注文・入力した商品など）をリセットします",
    resetDialogBodyPrefix: "",
    resetDialogBody:
      "リセット後はデータの回復ができません。本当にリセットしますか？",
    pinRequiredForReset: "リセットするには、ピンを入力してください。",
    pin: "ピン",
    instanceNameLabel: "インスタンス名",
    create: "作成",
    resetAction: "リセット",
    setPinTitle: "ピンを設定",
    newPinLabel: "新しいピン",
    confirmPinLabel: "ピンの確認",
    importPinInfo: "インポートするには、PINを入力してください。",
    importAction: "インポート",
    importErrorTitle: "インポートエラー",
    importErrorBody: "インポート中にエラーが発生しました。",
  },
  editItems: {
    saving: "保存",
    editingTitle: "「{{name}}」を編集中",
    noItems: "商品がありません",
    addItem: "商品を追加",
    newItemTitle: "新しい商品を追加",
    editItemTitle: "商品を編集",
    nameLabel: "商品名",
    priceLabel: "価格",
    initialStockLabel: "初期在庫",
    deleteItemTitle: "商品を削除",
    deleteConfirmation:
      "本当にこの商品を削除しますか？削除すると元に戻せませんが、この商品がある注文は削除されません。",
    edit: "編集",
    delete: "削除",
    itemDetails:
      "価格: {{price}}円, 初期在庫: {{initialStock}}個, 現在の在庫: {{stock}}",
  },
  history: {
    title: "注文履歴",
    back: "戻る",
    csvDownload: "CSVダウンロード",
    noOrders: "注文がありません",
    stats: {
      orders: "注文数",
      avgRevenue: "平均注文の売上",
      revenue: "売り上げ",
    },
    statsValues: {
      orders: "{{count}}件",
      avgRevenue: "{{value}}",
      revenue: "{{value}}",
    },
    downloadPinInfo:
      "データのCSVをダウンロードするには、PINを入力してください。",
  },
  instance: {
    back: "戻る",
    edit: "編集",
    orderHistory: "注文履歴",
    deleteOrder: "この注文を削除",
    noItems: "商品がありません。",
    addItemsHint: "上の編集ボタンをクリックして商品を追加してください。",
    totalLabel: "合計 ({{count}}品)",
    paidLabel: "お預かり金",
    changeLabel: "お釣り",
    orderDeletedSnackbar: "注文が削除されました",
    orderSavedTitle: "注文が保存されました",
    deleteOrderButton: "注文を削除",
  },
  pinDialog: {
    title: "ピンを入力",
    noPinSet: "ピンが設定されていませんので、確認ボタンを押してください。",
    label: "ピン",
    confirm: "確認",
  },
  orderDialog: {
    total: "合計",
    paid: "お預かり金",
    change: "お釣り",
    delete: "削除",
    close: "閉じる",
    totalValue: "{{value}}",
    paidValue: "{{value}}",
    changeValue: "{{value}}",
    itemQuantity: "{{count}}個",
  },
  instanceButton: {
    delete: "削除",
    downloadCsv: "CSVとしてDL",
    export: "エクスポート",
    confirmDeleteTitle: "インスタンスを削除",
    confirmDeleteBody:
      "このインスタンスを本当に削除してもよろしいですか？削除後は、元に戻すことができません。このインスタンスの注文・商品はすべて削除されますので、ご注意ください。",
    confirmDeleteAction: "{{name}}を削除",
    pinInfoDelete: "PINを入力して、インスタンスを削除します。",
    pinInfoDownload: "CSVをダウンロードするには、PINを入力してください。",
    pinInfoExport:
      "インスタンスをエクスポートするには、PINを入力してください。",
    statsSummary: "{{items}}品 · {{purchases}}件",
  },
  error: {
    title: "エラーが発生しました。",
    hint: "意外とエラーが発生しました。GitHubにIssueを作成してください。下のクリップボードボタンを押してエラーをコピーしてご利用ください。",
    copy: "コピーする",
    copySuccess: "クリップボードにコピーしました。",
    copyFail: "クリップボードへのコピーに失敗しました。",
    more: "もっと見る",
    backHome: "ホームに戻る",
  },
  store: {
    importFailed: "インスタンスを読み取ることに失敗しました",
    noFileSelected: "ファイルが選択されていません",
    consoleCheck: "コンソールを確認してください。",
    deletedLabel: "削除された",
    instanceExists:
      "このインスタンスはもう存在します。削除してからまた試してください。",
  },
  numberPad: {
    submit: "終了",
  },
  languageSelect: "言語を選択",
};

export default translation;
