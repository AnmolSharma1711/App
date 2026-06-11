import { auth } from './firebase';

/**
 * Returns the currently logged-in Firebase user's UID, or null if not authenticated.
 */
export const getCurrentUid = (): string | null => {
  return auth.currentUser?.uid ?? null;
};

/**
 * Returns the currently logged-in Firebase user's phone number or display name.
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
