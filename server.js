'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 4003;

//元データ
let originData = [
    {
        "work": '未発送',
        "paypal_txn_id": '',
        "clickpost_id": '',
        "payer_email": '',
        "description": 'Nefry BT x 1',
        "title": `菅原のびすけ`,
        "photo": './images/ds.png',
        "progress": 0,
        "address": `東京都千代田区外神田2-9-3\nユニオンビル工新 8F`,
        "address_zip": '101-0021'
    }
]

// let originData = [
//     {"work": "未発送", "description": "Nefry BT x 1", "title": "菅原のびすけ", "photo": "./images/ds.png", "progress": 0, "address": "東京都千代田区外神田2-9-3\nユニオンビル工新 8F", "address_zip":"101-0021"},
//     {"work": "ラベル申込/決済_済", "description": "Nefry BT x 1", "title": "菅原のびすけ", "photo": "./images/ds.png", "progress": 20, "address": "東京都千代田区外神田2-9-3\nユニオンビル工新 8F", "address_zip":"101-0021"},
//     {"work": "ラベル印字_済", "description": "Nefry BT x 1", "title": "菅原のびすけ", "photo": "./images/ds.png", "progress": 40, "address": "東京都千代田区外神田2-9-3\nユニオンビル工新 8F", "address_zip":"101-0021"},
//     {"work": "パッケージング_済", "description": "Nefry BT x 1", "title": "菅原のびすけ", "photo": "./images/ds.png", "progress": 60, "address": "東京都千代田区外神田2-9-3\nユニオンビル工新 8F", "address_zip":"101-0021"},
//     {"work": "発送完了", "description": "Nefry BT x 1", "title": "菅原のびすけ", "photo": "./images/ds.png", "progress": 80, "address": "東京都千代田区外神田2-9-3\nユニオンビル工新 8F", "address_zip":"101-0021"},
//     {"work": "配送完了", "description": "Nefry BT x 1", "title": "菅原のびすけ", "photo": "./images/ds.png", "progress": 100, "address": "東京都千代田区外神田2-9-3\nユニオンビル工新 8F", "address_zip":"101-0021"},
// ];

app.get('/', (req, res) => res.sendFile(__dirname+'/index.html'));
app.get('/getData', (req, res) => res.json(originData));
app.put('/update', (req, res) => {
    const updateData = JSON.parse(req.body.data);
    originData = updateData; //元データを更新
    console.log(originData);
    res.json(originData);
});

app.post('/ipn', async (req, res) => {
    const ipn = req.body; //PayPalのWebhook Body
    console.log(ipn)
    const addItem = {
        "work": "未発送",
        "paypal_txn_id": ipn.txn_id,
        "clickpost_id": '',
        "payer_email": ipn.payer_email,
        "description": ipn.item_name,
        "title": `${ipn.first_name} ${ipn.last_name}`,
        "photo": "./images/ds.png",
        "progress": 0,
        "address": `${ipn.address_state}${ipn.address_city}\n${ipn.address_street}`,
        "address_zip": ipn.address_zip
    };
    originData.push(addItem); //元データに追加
    res.end(JSON.stringify({message: 'Success!'}));
});

app.listen(PORT);
console.log(`listening on *:${PORT}`);

//サンプル用途 https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FYZTHBMZWHSTG
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const request = require('request');
// const VM_URL = process.env.MAIN_HOST || 'https://ac0becfc.ngrok.io';

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(__dirname+'/'));

// const PORT = process.env.PORT || 4003;

// app.get('/', (req, res) => res.sendFile(__dirname+'index.html'));

// //一次受け WebApps
// app.post('/ipn_webapps', async (req, res) => {
//     await request.post(VM_URL+'/ipn_vm').form(req.body);
//     res.end(JSON.stringify({message: 'Success!'}));
// });

// //実際の中身
// app.post('/ipn_vm', async (req, res) => {
//     console.log(req.body); //PayPalから送られて来る情報の確認
//     const response = {message: 'Success!'};
//     res.end(JSON.stringify({message: 'Success!'}));
// });

// app.listen(PORT);
// console.log(`listening on *:${PORT}`);