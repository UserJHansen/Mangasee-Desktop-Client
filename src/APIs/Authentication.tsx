// import React from 'react';

// import Store from './storage';
// import MangaAPI from './mangaAPI';

// export default class Authentication {
//   private store = new Store();

//   private AuthContext = React.createContext(false);

//   async isLoggedIn(): Promise<boolean> {
//     return !!(
//       this.store.get('email') &&
//       this.store.get('email') !== '' &&
//       (await MangaAPI.checkValidToken())
//     );
//   }

//   async attemptLogin(email: string, password: string): Promise<string | true> {
//     const result = await MangaAPI.login(email, password);

//     if (result === true) {
//       this.store.set('email', email);
//       return true;
//     }
//     return result;
//   }

//   render() {
//     return this.AuthContext.Provider;
//   }
// }
import React, { useContext, useState, useEffect, createContext } from 'react';

const AuthContext = createContext([]);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children: Record<string,unknown> }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signin = (email, password) => {
    const promise = new Promise(function (resolve, reject) {
      resolve(true)
    });

    return promise;
  };

  const signout = () => {
    return true;
  };

  useEffect(() => {
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   console.log(user);
    //   setCurrentUser(user);
    //   setLoading(false);
    // });
    // return unsubscribe;
  });

  const value = {
    signin,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
