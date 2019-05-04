"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
class ReadWriteQueue {
    constructor(filePath) {
        this.queue = [];
        this.filePath = filePath;
    }
    next() {
        if (this.queue.length === 0)
            return;
        const task = this.queue[0];
        if (task[0] == "write") {
            Fs.writeFile(this.filePath, task[1], "utf-8", (err) => {
                this.queue.shift();
                const cb = task[2];
                cb(err);
            });
        }
        else if (task[0] == "read") {
            Fs.readFile(this.filePath, { encoding: "utf-8" }, (err, data) => {
                this.queue.shift();
                const cb = task[1];
                cb(err, data);
            });
        }
    }
    write(content, cb) {
        this.queue.push(["write", content, cb]);
        if (this.queue.length === 1) {
            this.next();
        }
    }
    read(cb) {
        this.queue.push(["read", cb]);
        if (this.queue.length === 1) {
            this.next();
        }
    }
}
exports.ReadWriteQueue = ReadWriteQueue;
//# sourceMappingURL=ReadWriteQueue.js.map