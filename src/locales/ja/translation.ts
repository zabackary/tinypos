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
    importDescription:
      "ファイルからインスタンスを完全に新しいコピーとしてインポートします。すでにあるインスタンスに注文を追加するには、マージを使ってください。",
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
    trackStockLabel: "在庫を管理する",
    initialStockLabel: "初期在庫",
    deleteItemTitle: "商品を削除",
    deleteConfirmation:
      "本当にこの商品を削除しますか？削除すると元に戻せませんが、この商品がある注文は削除されません。",
    edit: "編集",
    delete: "削除",
    itemDetailsUntracked: "価格: {{price}}円, 在庫管理なし",
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
    undo: "元に戻す",
    orderSavedTitle: "注文が保存されました",
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
    itemQuantityWithPrice: "{{count}}個 · 単価{{unitPrice}}",
    lineTotal: "{{value}}",
    differentClient: "この注文は別のコンピューターで行われました",
  },
  instanceButton: {
    more: "その他",
    delete: "削除",
    downloadCsv: "CSVとしてDL",
    downloadCsvDescription: "他のツールでの分析用",
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
    mergeUnsupportedVersion:
      "このファイルは古いバージョンのアプリで書き出されたため、マージできません。書き出したコンピューターのアプリを更新して、もう一度書き出してください。",
    instanceExists:
      "このインスタンスはこのコンピューターにすでに存在します。このファイルの注文を既存のインスタンスに追加するには、代わりに「ファイルからマージ」をお試しください。",
  },
  merge: {
    menuItem: "ファイルからマージ",
    explanation:
      "マージは2つの履歴を結合しようとします。最初に1台のコンピューターから書き出したインスタンスで最もうまく動作します。",
    mismatchTitle: "別のインスタンス",
    mismatchBody:
      "このファイルは、マージ先（「{{name}}」）とは別のインスタンス（「{{fileName}}」）から書き出されています。意図した操作ではない可能性があります。それでもマージしますか？",
    mismatchContinue: "それでもマージ",
    pickInstanceTitle: "どのインスタンスにマージしますか？",
    pinInfo:
      "ファイルの注文をこのインスタンスにマージするにはPINを入力してください。",
    errorTitle: "マージできませんでした",
    summaryTitle: "ファイルからマージ",
    alreadyMergedNone:
      "このコンピューターには、このファイルを書き出したコンピューターの変更がすでにマージされており、新しい変更はありません。",
    alreadyMergedOrders:
      "このコンピューターには、このファイルを書き出したコンピューターの変更がすでにマージされていますが、新しい注文が{{count}}件あります。",
    alreadyMergedOther:
      "このコンピューターには、このファイルを書き出したコンピューターの変更がすでにマージされていますが、ほかにも新しい変更があります。",
    noChanges: "マージする新しい変更はありません。",
    summaryBody: "新しい注文{{count}}件を「{{name}}」に追加します。",
    newItems: "新しい商品{{count}}件を追加します：",
    conflictsNote: "{{count}}件の違いについて確認が必要です。",
    priceWarning:
      "{{count}}件の注文で、保存された商品の価格が合計と一致しません。古いバージョンのアプリで書き出されたファイルの可能性があります。",
    merge: "マージ",
    mine: "このコンピューター",
    theirs: "ファイル",
    keepMine: "こちらを残す",
    useTheirs: "ファイルを使う",
    applyToAll: "同じ種類の残り{{count}}件にも適用",
    itemFieldsTitle: "商品の違い",
    itemFieldsBody: "「{{name}}」の名前または価格がファイルと異なります。",
    itemDeletedTitle: "商品の削除状態の違い",
    itemDeletedBody:
      "「{{name}}」は一方のコンピューターでのみ削除されています。",
    purchaseDeletedTitle: "注文の削除状態の違い",
    purchaseDeletedBody:
      "{{date}}の注文は一方のコンピューターでのみ削除されています。",
    stateDeleted: "削除済み",
    stateActive: "削除されていない",
    doneTitle: "マージ完了",
    doneBody: "注文{{orders}}件、商品{{items}}件を追加しました。",
  },
  numberPad: {
    submit: "終了",
  },
  languageSelect: "言語を選択",
};

export default translation;
