

import React from 'react';
import './user.css';
import UserAuth from '../UserAuth/UserAuth';

function User({ user, setUser }) {

  return (
    <div className="user-page">
      
      {!user ?
       (
        <UserAuth onAuthSuccess={setUser} />
      ) : (
        <div className="user-details">
          <h2>User Details</h2>
            
          <table className="user-details-table">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Wifi Plan</th>
                <td>{user.wifi_plan || '-'}</td>
              </tr>
              <tr>
                <th>OTT Plan</th>
                <td>{user.ott_plan || '-'}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>{user.start_date || '-'}</td>
              </tr>
              <tr>
                <th>End Date</th>
                <td>{user.end_date || '-'}</td>
              </tr>
            </tbody>
          </table>
          <button className="logout-btn user-logout-btn" onClick={() => setUser(null)}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default User;
