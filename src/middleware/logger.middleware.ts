import { Injectable, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('----------Incoming Request--------');
    this.logger.log(
      `Timestamp: ${new Date().toISOString()} | Method: ${req.method} | Path: ${
        req.originalUrl
      }`,
    );
    if (Object.keys(req.body).length > 1) {
      // Copy the body object and delete the password field
      const body = { ...req.body };
      if (body.password) {
        body.password = body.password.replace(/./g, '*');
      }
      this.logger.log(`Body: ${JSON.stringify(body)}`);
    }
    if (Object.keys(req.params).length > 1)
      this.logger.log(`Params: ${JSON.stringify(req.params)}`);
    if (Object.keys(req.query).length > 0)
      this.logger.log(`Query: ${JSON.stringify(req.query)}`);
    this.logger.log('----------End of Incoming Request--------');
    next();
  }
}
