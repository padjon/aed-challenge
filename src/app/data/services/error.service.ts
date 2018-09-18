import { EventEmitter } from 'events';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService extends EventEmitter {
    constructor() {
        super();
    }

    public handleConnectionError(error) {
        console.warn('Connection Error');
        console.warn(error);
        this.emit('exception', 'The server is currently unreachable. This might be caused by missing internet connectivity or server maintenance.');
    }
}
