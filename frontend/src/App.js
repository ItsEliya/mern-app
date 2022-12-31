import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NewPlace from './places/pages/NewPlace';
import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';


function App() {
  const {token, login, logout, userId} = useAuth();
  let routes;
  if (token) {
    routes = (
      <Fragment>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/places/new' element={<NewPlace />} />
        <Route path='/places/:placeId' element={<UpdatePlace />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='*' element={<Navigate to="/auth" />} />
      </Fragment>
    );
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, userId, login, logout }}>
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            {routes}
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
