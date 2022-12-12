import Pocketbase from 'pocketbase';

const PB_URL = process.env.PB_URL;

const pb = new Pocketbase(PB_URL);

export const signIn = async ({ email, password }) => {
  const authData = await pb
    .collection('users')
    .authWithPassword(email, password);
  return authData;
};
