const autobahn = require("autobahn");

export default class Socket {

    // _session: boolean = false;
    // _listeners: any = {};
    private _uri: string;

    connection: any;


    constructor(uri: string, config?:any) {
        this._uri = uri;
        // this.uri = uri;

        this.connect();

    }

    connect() {
        // const connection = new autobahn.Connection({url: this._uri , realm: "/quiz/live"});
        //
        // connection.onopen = (session: any) => {
        //
        //     session.subscribe('socket/connect', (args:any) => {
        //
        //     });
        //     session.subscribe('socket/disconnect', (args:any) => console.log);
        //
        // };
        //
        // connection.open();

        // autobahn.Connection(
        //     this._uri,
        //     (session: any) => {
        //         this.fire({type: "socket/connect", data: session});
        //     },
        //     (code: any, reason: any) => {
        //         this._session = false;
        //         this.fire({type: "socket/disconnect", data: {code: code, reason: reason}});
        //     }
        // )
    }

    // on(type: any, listener: any) {
    //     if (typeof this._listeners[type] == "undefined") {
    //         this._listeners[type] = [];
    //     }
    //
    //     this._listeners[type].push(listener);
    // };
    //
    // fire(event:any) {
    //     if (typeof event == "string") {
    //         event = {type: event};
    //     }
    //     if (!event.target) {
    //         event.target = this;
    //     }
    //
    //     if (!event.type) {  //falsy
    //         throw new Error("Event object missing 'type' property.");
    //     }
    //
    //     if (this._listeners[event.type] instanceof Array) {
    //         let listeners = this._listeners[event.type];
    //         for (let i = 0, len = listeners.length; i < len; i++) {
    //             listeners[i].call(this, event.data);
    //         }
    //     }
    // };
    //
    //
    // off(type:any, listener:any) {
    //     if (this._listeners[type] instanceof Array) {
    //         let listeners = this._listeners[type];
    //         for (let i = 0, len = listeners.length; i < len; i++) {
    //             if (listeners[i] === listener) {
    //                 listeners.splice(i, 1);
    //                 break;
    //             }
    //         }
    //     }
    // }
}