import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  authenticated: false,
  role: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    authenticated: false,
    role: null,
    user: null,
  });

  const login = ({ email, role }) => {
    setState({
      authenticated: true,
      role,
      user: { email },
    });
  };

  const logout = () => {
    setState({
      authenticated: false,
      role: null,
      user: null,
    });
  };

  const value = useMemo(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
