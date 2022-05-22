import { JwtHelperService } from "@auth0/angular-jwt";

export class JwtService {
  static decodeJWT(token: string) {
    const helper = new JwtHelperService();
    return helper.decodeToken(token);
  }
}
