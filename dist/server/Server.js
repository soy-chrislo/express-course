import express from "express";
export class Server {
    app;
    constructor() {
        this.app = express();
    }
    listen(port, callback) {
        this.app.listen(port, callback);
    }
    get(path, callback) {
        this.app.get(path, callback);
    }
    use(path, router) {
        this.app.use(path, router);
    }
}
