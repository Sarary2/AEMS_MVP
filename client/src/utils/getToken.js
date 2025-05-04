// src/utils/getToken.js
import { getAuth } from 'firebase/auth';

export async function getToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return await user.getIdToken(); // Get Firebase token
  } else {
    console.error('User not authenticated');
    return null;
  }
}
