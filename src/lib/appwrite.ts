import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('685cae77001115d72d29') // Replace with your project ID
    .setDevKey('5dbe296bd9198804ea5d64b773284146c2a298aa89bbd688f4ebf09021710629f2ec1e7d521130142f0201d2caf825da096300521c68a23427f4366b4e95f6ef037bb8c1e45772f0c766a182489e4d3924c033c2397ba990984ba3d50c446c37e575cfd215427c414df93268968fd4b2c8749227addff1c534c6d630137fae8f')

export const account = new Account(client);
export const databases = new Databases(client)
export { ID } from 'appwrite';