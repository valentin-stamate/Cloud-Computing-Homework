const host = 'https://h3-backend-ylmmpdd4za-lz.a.run.app';

export class Endpoints {
  static POSTS = `${host}/posts`;
  static POST = `${host}/posts/`;
  static PUT = `${host}/posts/`;
  static DELETE = `${host}/posts/`;

  static TRANSLATE = `${host}/translate`;
  static TAGS = `${host}/tag`;

  static SHUFFLE = 'https://europe-central2-cloud-computing-345016.cloudfunctions.net/shuffle';
}
