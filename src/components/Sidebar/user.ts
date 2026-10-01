import type { RootState } from '../../store/store';

type UserData = RootState['auth']['userData'];

// Display name, else the part of the email before @.
export const userName = (user: UserData) => user?.displayName || user?.email?.split('@')[0] || '';

export const userInitial = (user: UserData) => (userName(user)[0] || '?').toUpperCase();
