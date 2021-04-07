import * as http from 'http';
import debug from 'debug';

import { Request, Response } from 'express';
import { ExpressApp } from '../app';
import * as cluster from 'cluster';
import { cpus } from 'os';

debug('custom-express:server');

if (cluster.isMaster) {
  const numCPUs = cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    console.log('Starting a new worker...');
    cluster.fork();
  });
} else {
  let App = new ExpressApp().express;
  let normalizePort = (val: number | string): number | string | boolean => {
    let port: number = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
  };

  const port = normalizePort(3000);
  App.set('port', port);

  App.all('*', (req: Request, res: Response, next: Function) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
    );
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    next();
  });

  let onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== 'listen') throw error;
    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  let onListening = (): void => {
    let addr = server.address();
    if (addr != null) {
      let bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      console.log(`Listening on ${bind}`);
    }
  };

  const server = http.createServer(App);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}
