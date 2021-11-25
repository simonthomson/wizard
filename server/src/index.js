import express from 'express';
import path from 'path';

import { serveApp } from './routes/home-routes';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../../app/build')));

app.get('/', serveApp);
app.get('/createGame', serveApp);


app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
