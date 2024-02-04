const express = require('express');
require('date-utils');
const fs = require('fs');
const path = require('path');
const ip = require('ip');
const QRCode = require('qrcode');

//start server
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get('/', (req, res) => {
    QRCode.toDataURL(`http://${ip.address()}:3000`, function (err, url) {
        res.send(`これは探究道場のメンバーの出席情報を管理するツールです。サーバー側は"/s"を、出席するには"/c"を開いてください。<img src="${url}">`);
      });
})

app.get('/api/attend', (req, res) => {
    date = Date.today().toFormat("YYYY_MM_DD").toString();
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
    //data.jsonを開く。なければ作る
    if(!fs.existsSync(`./data/${date}.json`)){
        fs.writeFileSync(`./data/${date}.json`, '[]');
    }
    //data.jsonを読み込む
    data = JSON.parse(fs.readFileSync(`./data/${date}.json`, 'utf8'));

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

/**
 * Checks if the given user is present in the data array.
 *
 * @param {any} user - the user to check for presence
 * @param {Array} data - the array to search for the user
 * @return {boolean} true if user is present, false otherwise
 */
check_attendance = (user, data) => {
    for(i = 0; i < data.length; i++){
        if(data[i] == user){
            return true;
        }
    }
    return false;
}

check_member = (user) => {
    member_data = JSON.parse(fs.readFileSync('./member.json', 'utf8'));
    for(i = 0; i < member_data.length; i++){
        if(member_data[i].name == user){
            return true;
        }
    }
    return false;
}
    

