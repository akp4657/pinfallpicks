import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
  })

export class UserService {
    api_url = '';

    constructor(private networkService: NetworkService) {
        this.api_url = ConstantsService.getApiUrl();
    }

    login(username: string, email: string, password: string) {
        const post_body = {
            username: username,
            email: email,
            password: password
        };

        return this.networkService.httpPost(this.api_url + '/login', post_body);
    }

    addUser(username: string, password: string, email: string) {
        const post_body = {
            username: username,
            email: email,
            password: password
        };

        return this.networkService.httpPost(this.api_url + '/addUser', post_body);
    }
}