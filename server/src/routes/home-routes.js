import path from 'path';

export function serveApp(req, res) {
  res.sendFile(path.join(__dirname, '../../../app/build/index.html'));
};
