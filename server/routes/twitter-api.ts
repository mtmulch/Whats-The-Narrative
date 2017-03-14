import { Router, Request, Response, NextFunction } from 'express';

import Twitter = require ('twitter');

export class TwitterApi {
    router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/api/twitterfeed/rightwing', this.makeTwitterClient, this.getRightWingTwitterResults, this.sendBackTweetResults);
        this.router.get('/api/twitterfeed/leftwing', this.makeTwitterClient, this.getLeftWingTwitterResults, this.sendBackTweetResults);
    }

    private makeTwitterClient(req: Request, res: Response, next: NextFunction): void {
        res.locals.twitterClient = new Twitter({
            consumer_key: 'dv1iRBGxLYjyKn41qpvayuI8U',
            consumer_secret: 'Der5Hk7WdnyYiFwCmRbx9akiFlAANbHdXT9ZVS4jYaNWU4w9E1',
            access_token_key: '249584013-wk8Vlc2jWdc95EqlOT7WvikOpH2Qe81YjKUb0Xxf',
            access_token_secret: 'hlGBlj3nB8VMpAfG6euyeZGs6o0pgW43wdfcSWtBM2faz'
        });
        next();
    }

    private getLeftWingTwitterResults(req: Request, res: Response, next: NextFunction): void {
        res.locals.twitterClient.get('search/tweets', { q: 'democrat' }, (error, tweets, response) => {
            res.locals.tweets = tweets;
            next();
        });
    }

    private getRightWingTwitterResults(req: Request, res: Response, next: NextFunction): void {
        res.locals.twitterClient.get('search/tweets', { q: 'republican' }, (error, tweets, response) => {
            res.locals.tweets = tweets;
            next();
        });
    }

    sendBackTweetResults(req: Request, res: Response): void {
        res.json(res.locals.tweets);
    }

}

export default new TwitterApi().router;