import {Injectable} from '@angular/core';

@Injectable()
export  class  DomainServices {
    domain = 'https://jieli.alewan99.com';

    constructor()
    {

    }

    taskServiceURLs = {
        loadCSV: '/task/loadCSV'
    };
}
