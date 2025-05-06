// import React, { createContext, useState, useContext } from 'react';

// // Create AuthContext to share authentication state
// const AuthContext = createContext();

// // Custom hook to access authentication state
// export const useAuth = () => useContext(AuthContext);

// // AuthProvider to wrap your app and manage authentication state
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state here

//   const login = () => setIsAuthenticated(true);   // Call this on login
//   const logout = () => setIsAuthenticated(false); // Call this on logout

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
