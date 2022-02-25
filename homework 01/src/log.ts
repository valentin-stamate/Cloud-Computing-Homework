import {APILog} from "./models";

export class Log {
       private list: APILog[] = [];

       add(item: APILog) {
           this.list.push(item);
       }

       get() {
           return {number: this.list.length, logs:this.list};
       }
}

export const serverLog = new Log();

