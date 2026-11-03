import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, refreshSession } from '../store/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const signIn = useCallback((credentials) => dispatch(login(credentials)).unwrap(), [dispatch]);
  const signOut = useCallback(() => dispatch(logout()), [dispatch]);
  const refresh = useCallback(() => dispatch(refreshSession()), [dispatch]);

  return { ...auth, login: signIn, logout: signOut, refreshSession: refresh };
}
