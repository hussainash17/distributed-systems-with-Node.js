import * as express from 'express';

// import express from 'express';
// const app = express();

export class ExpressApp {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    console.log('all middle ware options will be loaded here');
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    let router = express.Router();

    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello From Typescript Express Node JS Server.',
      });
    });
    this.express.use('/', router);
  }
}
