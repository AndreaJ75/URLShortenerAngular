import {Authority} from './authority';

export interface AppUser {
    id: number;
    uid: string;
    firstName: string;
    name: string;
    email: string;
    creationDate: Date;
    updateDate: Date;
    authorities: Authority[];
}
