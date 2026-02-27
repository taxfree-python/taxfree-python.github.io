---
title: Android から家の Mac の Claude Code にそのまま戻る
date: 2026-02-27T00:00:00+09:00
math: true
draft: false
---

外出先で「あ、さっきの Claude Code の続きやりたい」ってなること、ありませんか。
私はけっこうあって、権限周りで詰まったときとか、ちょっとした修正を投げたいときに、スマホからなんとかしたいと思うことが多いです。

ちなみに、最近 Claude Code に [Remote Control](https://code.claude.com/docs/en/claude-code-on-the-web) という機能が追加されて、スマホからセッションを引き継げるようになりました。ただしこれは Max プラン (サブスク) 向けの機能で、API 経由で使っている人は対象外です。私は API で使っているので、自前で環境を作る必要がありました。

この記事は、**[Tailscale](https://tailscale.com/) + SSH + [tmux](https://github.com/tmux/tmux)** を使って、Android から自宅の Mac に安全に入り、tmux 上で動いている Claude Code を「同じセッションのまま」再開する方法のまとめです。普段は VSCode のターミナルで作業していて、外から復帰できる部分だけ tmux に寄せる運用にしています。

<!--more-->

## できるようになること

- ルーターの**ポート開放なし**で Android → Mac に接続 (Tailscale)
- Mac 上の **tmux セッション**に attach して作業を再開
- tmux の中で起動した **Claude Code の同じプロセス**にそのまま戻れる (「引き継ぎ」ではなく「同じ現物に再接続」)

## 全体像

ざっくりいうと、こういう構成です。

- **[Tailscale](https://tailscale.com/)**: Android と Mac を同じ閉じたネットワークに入れる
- **SSH**: そのネットワーク上の Mac に入る (Remote Login)
- **[tmux](https://github.com/tmux/tmux)**: セッションを保持して、外出先から attach できるようにする
- **Claude Code**: tmux の中で起動しておく (ここが肝)

---

## 1. Tailscale の準備

Mac と Android の両方に [Tailscale](https://tailscale.com/) を入れて、同じアカウントでログインします。個人利用なら無料プラン (Personal) で十分です。Android 側は VPN を ON にしておきます。

Mac 側で Tailscale の IP を確認しておきます (この記事では `<MAC_TS_IP>` と呼びます)。

```bash
tailscale ip -4
```

## 2. SSH (Remote Login) の準備

macOS のリモートログインを ON にします。

**システム設定 → 一般 → 共有 → リモートログイン**

- 「Only these users」にして**自分だけ**を許可 (`Administrators` が入っているなら外すと堅い)
- ルーターでポート開放はしない (Tailscale の `100.x` 宛てで十分)

> `Connection refused` が出る場合は、だいたい Remote Login が OFF になっています。

## 3. SSH 鍵の設定

外出先から入るならパスワードより鍵が安心です。Android ([Termux](https://termux.dev/)) 側で SSH 鍵を作って、Mac 側の `~/.ssh/authorized_keys` に公開鍵を登録します。

- 鍵は**ユニーク名**で作ると後で管理が楽 (例: `id_ed25519_tail_mac`)
- Mac 側はファイル名を分ける必要はなく、`authorized_keys` に追記するだけ

## 4. tmux + Claude Code の運用

普段どおり VSCode のターミナルを使って構いません。ただし、**`claude` は tmux セッション内で起動**しておきます。これが外から戻れるかどうかの分かれ目です。

例 (セッション名は好きに):

- `tmux new -As cc-2156` でセッションに入る
- その中で `claude` を起動
- 外出前に detach (中のプロセスは生き続ける)

複数の Claude を並列に走らせている場合は、セッションを分ける (`cc-experiment`、`cc-2156` など) か、1 セッションの中で tmux の window を分けるか、どちらでも OK です。外から迷子になりにくいのは**セッション分割**だと思います。

## 5. 外出先 (Android) から同じ Claude に戻る

Android (Termux) から:

1. Tailscale IP (`<MAC_TS_IP>`) 宛てに SSH
2. `tmux attach` で目的のセッションに入る

これだけで、家で動かしていた Claude Code の**同じプロセス**に戻れます。

### detach し忘れたらどうなる?

detach し忘れても、スマホから同じ tmux セッションに attach 自体はできます。ただし Mac 側も attach したままだと二重 attach になって、同時に入力すると文字が混ざる可能性があります。外から操作するときは、必要に応じて**他の attach を外す**運用にすると安全です。

## 6. macOS のスリープ対策

Mac がスリープすると外からは到達できなくなります。クラムシェル運用 + 給電でも設定次第で寝ることがあるので注意です。

外出中に確実に起こしておきたい場合は、macOS 標準の `caffeinate` が手軽です。

```bash
caffeinate -s
```

`-s` はシステムスリープを抑止するオプションです。外出前にターミナルで叩いておけば、プロセスが生きている間はスリープしなくなります。帰ってきたら Ctrl+C で止めるだけです。

## 7. Tips: tmux で Claude Code のスクロールがおかしくなる問題

tmux 内で Claude Code を動かすと、マウスホイールが通常のスクロールではなく**チャット欄の履歴移動** (上下矢印相当) として処理されることがあります。過去ログが見返しづらくなるやつです。

以下のような設定を `~/.tmux.conf` に書くと改善します。

```tmux
set -g mouse on

bind -n WheelUpPane if -F "#{pane_in_mode}" "send -M" "copy-mode -e; send -M"
bind -n WheelDownPane if -F "#{pane_in_mode}" "send -M" "send -M"

bind -n S-WheelUpPane send -M
bind -n S-WheelDownPane send -M
```

## まとめ

- **Tailscale + SSH + tmux** で、外出先から Mac の作業を「そのまま」再開できる
- 鍵は **Claude Code を tmux の中で起動**しておくこと
- セキュリティ的には「ポート開放なし」「許可ユーザーを自分だけ」「鍵ログイン」が基本線
- tmux ならではの操作感の差 (スクロール等) は `.tmux.conf` で吸収できる
