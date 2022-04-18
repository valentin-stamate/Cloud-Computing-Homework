export class UtilService {

  static getDate(seconds: any){
    let t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(seconds._seconds);
    return t;
  }

}
