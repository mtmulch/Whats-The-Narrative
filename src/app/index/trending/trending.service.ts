import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Trending } from './trending';

@Injectable()
export class TrendingService {
    private apiUrl = '/api/popularnewssearchs/trending';
    constructor(private http: Http) {}

    public getTrending(): Observable<any[]> {
        console.log(this.apiUrl);
        return this.http.get(this.apiUrl)
            .map(this.parseTrendingSearchData)
            .catch(this.handleError);
    }

    private parseTrendingSearchData(res: Response) {
        // console.log(res);
        const body = res.json();
        console.log('trending results array');
        console.log(body);
        return body || {};
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}