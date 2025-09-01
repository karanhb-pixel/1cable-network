import "./user.css";
import UserAuth from "../UserAuth/UserAuth";
import { use, useEffect, useState } from "react";
import axios from "axios";
import LoadingIcon from "../component/Loading_icon";

const User = ({ user, setUser }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const admin_code = () => {
    if (loading) return <LoadingIcon/>;

    return (
      <div className="admin-users-table">
        <h2>All Users</h2>
        <table className="user-details-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Wifi Plan</th>
              <th>OTT Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u, idx) => (
              <tr key={idx}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.wifi_plan || "-"}</td>
                <td>{u.ott_plan || "-"}</td>
                <td>{u.start_date || "-"}</td>
                <td>{u.end_date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="logout-btn user-logout-btn"
          onClick={() => setUser(null)}
        >
          Logout
        </button>
      </div>
    );
  };

  const user_code = () => {
    if (loading) return <LoadingIcon/>;
    const details = allUsers[0];
    if (!details) return <div>No user details found.</div>;
    return (
      <div className="user-details">
        <h2>User Details</h2>
        <table className="user-details-table">
          <tbody>
            <tr>
              <th>Username</th>
              <td>{details.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{details.email}</td>
            </tr>
            <tr>
              <th>Wifi Plan</th>
              <td>{details.wifi_plan || "-"}</td>
            </tr>
            <tr>
              <th>OTT Plan</th>
              <td>{details.ott_plan || "-"}</td>
            </tr>
            <tr>
              <th>Start Date</th>
              <td>{details.start_date || "-"}</td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>{details.end_date || "-"}</td>
            </tr>
          </tbody>
        </table>
        <button
          className="logout-btn user-logout-btn"
          onClick={() => setUser(null)}
        >
          Logout
        </button>
      </div>
    );
  };
  
  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_ROOT}/user-plans`, {
          headers: user.token ? { Authorization: `Bearer ${user.token}` } : {}
        })
        .then((res) => setAllUsers(res.data))
        .catch(() => setAllUsers([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="user-page">
      {!user ? (
        <UserAuth onAuthSuccess={setUser} />
      ) : user.isAdmin ?  admin_code() : user_code()}
    </div>
  );
};


export default User;
