const express=require('express')
const app=express();
const cors=require('cors');
const {logger}=require('./middlewares/logEvents');
const errorHandler=require('./middlewares/ErrorHandler');
const path = require('path');

const PORT = process.env.PORT || 3500;

app.use(logger);

const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));


app.get('^/$|/index(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/new-page(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});
app.get('/old-page(.html)?', (req, res)=>{
    res.redirect(301, '/new-page.html');
});
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.get('hello(.html)?', (req, res, next)=>{
    console.log('attempted to load hello.html');
    next()
},(req,res)=>{
    res.send('Hello World');
});

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));