# どんなゲーム？

1. URLが発行される
2. URLにアクセスするとユーザー作成されて、リダイレクト  
（ユーザー追加は全員に同期される）
3. 時刻になると自動で開始されて、サーバー同期で赤いマスを取り合う  
（サーバーと赤いマスの対象を同期しながら、ユーザー間のポイント取得も同期してる）
4. サーバーのPointテーブルから結果を表示してるだけ

ユーザー名に色がついてるのは、自分がどれかわかるようにしてる！

| 1 | 2 | 3 | 4 |
| ----- | ------ | ----- | ----- |
| ![image](https://user-images.githubusercontent.com/22848303/90333518-758d3900-e001-11ea-9730-3ef9fdf75f89.png) | ![image](https://user-images.githubusercontent.com/22848303/90333467-eb44d500-e000-11ea-94b0-089d65c87026.png) |  ![image](https://user-images.githubusercontent.com/22848303/90333471-f7c92d80-e000-11ea-8faf-64097f823148.png) | ![image](https://user-images.githubusercontent.com/22848303/90333493-2c3ce980-e001-11ea-8e95-920acd4ea34a.png) | 

# localhost手順
1. railsの手順を完了する（https://github.com/yujiG/mqtt_karuta）
2. yarn install
3. yarn run dev
