import { createContext } from 'react';

/**
 * Lives in its own module so `AuthProvider.jsx` only exports a component —
 * which keeps react-refresh happy and the fast-refresh boundary intact.
 */
export const AuthContext = createContext(null);
