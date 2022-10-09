import React, { useEffect, useState } from 'react';

import UserList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

function User() {
    const [loadedUsers, setLoadedUsers] = useState();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users');

                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        fetchUser();
    }, [sendRequest]);


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
        </React.Fragment>
    );
}

export default User;
