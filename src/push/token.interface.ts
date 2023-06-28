import { AppOptions } from 'firebase-admin';

export interface Token {
  id: string;
  token: string;
  username: string;
  device: string;
}

export interface Topic {
  id: string;
  topic: string;
  title: string;
}
export interface Config extends AppOptions {
  id: string;
}
