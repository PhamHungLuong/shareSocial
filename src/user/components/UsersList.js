import React from 'react';

import './UsersList.css';
import UserItem from './UserItem';

function UserList(props) {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <h2>No User Found</h2>
            </div>
        );
    }

    return (
        <ul className='user-list'>
            {props.items.map((user) => {
                return (
                    <UserItem key={user.id} id={user.id} image={user.image} name={user.name} placeCount={user.places.length} />
                );
            })}
        </ul>
    );
}

export default UserList;
