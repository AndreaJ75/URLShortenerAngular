import DateTimeFormat = Intl.DateTimeFormat;

export interface UrlForUser {
  id : number;
  urlLong: string;
  maxClickNumber: number;
  expirationDate: DateTimeFormat;
  appPassword: string;
}
