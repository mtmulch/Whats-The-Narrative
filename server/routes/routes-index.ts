import { Router } from 'express';

import UserAuthenication from './user-authenication';
import NewsLetterSignUp from './newslettersignup';
import TwitterApi from './twitter-api';


class Routers {
    router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use('/userauth', UserAuthenication);
        this.router.use('/twitterfeed', TwitterApi);
        this.router.post('/newsletter', NewsLetterSignUp);
        // TODO : put reference to sub routers here (external api calls etc).
    }
}


export default new Routers().router;