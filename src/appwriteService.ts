import {Client, Account, Databases} from 'appwrite';
import {appwriteEndpoint, appwriteProjectId} from './appwrite.constants.ts';

const client = new Client();

client
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

export const account = new Account(client);
const databases = new Databases(client);
export { ID } from 'appwrite';
export { client, databases };
