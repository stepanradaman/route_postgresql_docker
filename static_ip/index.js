const ip = require('ip');
const express = require('express');
const edgesRouter = require('./routes/edges.routes');
const path = require('path');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT || 3000;
const app = express();

const dirname = path.resolve();
app.use(express.static(path.resolve(dirname, 'html')));

app.use(
    '/geoserver',
    createProxyMiddleware({
        // target: 'http://' + String(ip.address()) + ':8081',
        target: 'http://172.19.0.1:8081',
        changeOrigin: true
    })
);

app.use(bodyParser.json());
app.use(express.json());
app.use('/api', edgesRouter);

console.log(ip.address());

app.listen(PORT, () => console.log('server started on port ${PORT}'));

