const express = require('express');
require('date-utils');
const fs = require('fs');
const path = require('path');

//start server
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('これは探究道場のメンバーの出席情報を管理するツールです。サーバー側は"/s"を、出席するには"/c"を開いてください。');
})

app.get('/api/attend', (req, res) => {
    date = Date.today().toFormat("YYYY_MM_DD").toString();
    //nameパラメータ取得
    user = req.query.name;

    //data.jsonを開く。なければ作る
    if(!fs.existsSync(`./data/${date}.json`)){
        fs.writeFileSync(`./data/${date}.json`, '[]');
    }
    //data.jsonを読み込む
    data = JSON.parse(fs.readFileSync(`./data/${date}.json`, 'utf8'));

    //dataに追加
    data.push(user);
    //書き込み
    fs.writeFileSync(`./data/${date}.json`, JSON.stringify(data));
    payload= {
        "name": user,
        "date": date,
        "num": 0
    }

    //jsonにして返す
    res.json(payload);
    
})
    

