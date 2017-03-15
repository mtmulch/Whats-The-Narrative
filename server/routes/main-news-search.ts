import { Router, Request, Response, NextFunction } from 'express';

import AylienNewsApi = require('aylien-news-api');


export class MainNewsSearch {
    router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/:searchterm', this.createAylienNewsInstance, this.createAylienNewsRightOrLeftWingSearch, this.performAylienNewsSearch, this.sendBackResults);
    }

    private createAylienNewsInstance(req: Request, res: Response, next: NextFunction): void {
        res.locals.AylienNewsInstance = new AylienNewsApi.DefaultApi();
        res.locals.AylienNewsInstance.apiClient.authentications['app_id'].apiKey = 'c2be3538';
        res.locals.AylienNewsInstance.apiClient.authentications['app_key'].apiKey = '7c3d695c5aa573f72f642a77937d6d5b';
        next();
    }

    private createAylienNewsRightOrLeftWingSearch(req: Request, res: Response, next: NextFunction): void {
        // TODO: add another parameter to this api url to determine if the user is left or right wing or we can search the database...
        // and default for just a plain search.
        res.locals.searchOptions = {
            'text': req.params.searchterm,
            'language': ['en'],
            'notLanguage': ['es', 'it'],
            'publishedAtStart': 'NOW-3DAYS',
            'publishedAtEnd': 'NOW',
            'sourceDomain': ['breitbart.com', 'theblaze.com', 'drudgereport.com', 'dailycaller.com', 'nationalreview.com', 'townhall.com']
        };

        // res.locals.searchOptions = {
        //     'text': req.params.searchterm,
        //     'language': ['en'],
        //     'notLanguage': ['es', 'it'],
        //     'publishedAtStart': 'NOW-3DAYS',
        //     'publishedAtEnd': 'NOW',
        //     'sourceDomain': ['huffingtonpost.co.uk', 'salon.com', 'dailykos.com', 'thedailybeast.com', 'alternet.org', 'motherjones.com']
        // };
        next();
    }

    private performAylienNewsSearch(req: Request, res: Response, next: NextFunction): void {
        res.locals.AylienNewsInstance.listStories(res.locals.searchOptions, (error, data, response) => {
            if (error) {
                // TODO: send the user an error
                console.log(error);
            } else {
                res.locals.stories = data.stories;
                next();
            }
        });
    }

    private sendBackResults(req: Request, res: Response): void {
        res.json(res.locals.stories);
    }
}

export default new MainNewsSearch().router;
