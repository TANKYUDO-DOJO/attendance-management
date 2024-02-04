const express = require('express');
require('date-utils');

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
    name = req.query.name;

    payload= {
        "name": name,
        "date": date,
        "num": 0
    }

    //jsonにして返す
    res.json(payload);
    
})
    

