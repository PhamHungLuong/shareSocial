import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import User from './user/pages/User';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

function App() {
    const { token, login, logout, userId } = useAuth();

    let routes;

    if (token) {
        routes = (
            <React.Fragment>
                <Route path="/" element={<User />}></Route>
                <Route path="/:userId/places" element={<UserPlaces />}></Route>
                <Route path="/places/new" element={<NewPlace />}></Route>
                <Route path="/place/:placeId" element={<UpdatePlace />}></Route>
            </React.Fragment>
        );
    } else {
        routes = (
            <React.Fragment>
                <Route path="/" element={<User />}></Route>
                <Route path="/:userId/places" element={<UserPlaces />}></Route>
                <Route path="/auth" element={<Auth />}></Route>
            </React.Fragment>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                login: login,
                logout: logout,
            }}
        >
            <Router>
                <MainNavigation />
                <main>
                    <Routes>{routes}</Routes>
                </main>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
