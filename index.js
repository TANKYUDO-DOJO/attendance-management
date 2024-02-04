const express = require('express');
require('date-utils');
const fs = require('fs');
const path = require('path');
const ip = require('ip');
const QRCode = require('qrcode');

//サーバーを立ち上げる
const app = express();
const port = 3000;
date = Date.today().toFormat("YYYY_MM_DD").toString();

//データファイルが無ければ作る。
if(!fs.existsSync(`./data/${date}.json`)){
    fs.writeFileSync(`./data/${date}.json`, '[]');
}

//テンプレートエンジンドをejsに設定
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//ルーティング

//メインページ
app.get('/', (req, res) => {
    QRCode.toDataURL(`http://${ip.address()}:3000/c`, function (err, url) {
        data={
            qr: url.toString(),
            members: get_data()
        }
        res.render('index', data);
      });
})

//出席ページ
app.get('/c', (req, res) => {
    res.render('attend')
})

//出席API
app.get('/api/attend', (req, res) => {
    date = Date.today().toFormat("YYYY_MM_DD").toString();
    //data.jsonを開く。なければ作る
    if(!fs.existsSync(`./data/${date}.json`)){
        fs.writeFileSync(`./data/${date}.json`, '[]');
    }
    //nameパラメータ取得
    user = req.query.name;
    if(user == ""){
        payload = {
            "name": "null",
            "date": date,
            "status": "noname"
        }
        res.json(payload);
        return}
    if(!check_member(user)){
        payload = {
            "name": user,
            "date": date,
            "status": "nomember"
        }
        res.json(payload);
        return
    }
    
    //data.jsonを読み込む
    data = get_data();

    //未出席ならば
    if(check_attendance(user, data)){
        payload = {
            "name": user,
            "date": date,
            "status": "already"
        }
        res.json(payload);
    }else
    {//dataに追加
    data.push(user);
    //書き込み
    fs.writeFileSync(`./data/${date}.json`, JSON.stringify(data));
    payload= {
        "name": user,
        "date": date,
        "num": data.length,
        "status": "ok"
    }

    //jsonにして返す
    res.json(payload);}
})

//すでに出席済みか否かを確認
check_attendance = (user, data) => {
    for(i = 0; i < data.length; i++){
        if(data[i] == user){
            return true;
        }
    }
    return false;
}

//名前が存在するか否かを確認
check_member = (user) => {
    member_data = JSON.parse(fs.readFileSync('./member.json', 'utf8'));
    for(i = 0; i < member_data.length; i++){
        if(member_data[i].name == user){
            return true;
        }
    }
    return false;
}
 
//データを取得
get_data = () => {
    date = Date.today().toFormat("YYYY_MM_DD").toString();
    data = JSON.parse(fs.readFileSync(`./data/${date}.json`, 'utf8'));
    return data;
}
