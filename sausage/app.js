var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sqlite database.');
});
app.get('/api/sausage_price', (req, res) => {
    db.all('SELECT * FROM sausage_price', (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json(rows);
    });
});
app.post('/api/insert', (req, res) => {
    let year = req.body.Year;  //body.XXX的XXX要符合資料庫欄位名稱
    let food = req.body.food;
    let sausage = req.body.sausage;
    let sql = 'INSERT INTO sausage_price (Year, food, sausage) VALUES (?,?,?)';
    db.run(sql, [year,food, sausage], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send('New sausage price inserted');
    });
});

module.exports = app;
