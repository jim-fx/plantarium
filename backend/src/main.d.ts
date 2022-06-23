declare namespace express {
  export interface Request {
    user: {
      sub: string;
    }
  }
}
