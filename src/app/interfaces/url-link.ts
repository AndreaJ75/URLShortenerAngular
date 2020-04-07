import { AppUser } from './app-user';

export interface UrlLink {
    id: number;
    urlLong: string;
    urlShortKey: string;
    urlPassword: string;
    clickNumber: number;
    maxClickNumber: number;
    expirationDate: Date;
    creationDate: Date;
    updateDate: Date;
    appUser: AppUser;
}
