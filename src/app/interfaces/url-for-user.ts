import DateTimeFormat = Intl.DateTimeFormat;

export interface UrlForUser {
  urlLong: string;
  maxClickNumber: number;
  expirationDate: DateTimeFormat;
  appPassword: string;
}
