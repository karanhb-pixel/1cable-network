import "./user.css";
import UserAuth from "../UserAuth/UserAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingIcon from "../../component/Loading_icon";
import { useUser } from "../../utils/useUser";
import { useNavigate } from "react-router-dom";
import Add_User from "../Add_User/Add_User";

const User = () => {
  const { user, setUser } = useUser();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const admin_code = () => {
    if (loading) return <LoadingIcon />;

    return (
      <div className="admin-users-table">
        <div className="admin-user-table-head">
          <h2>All Users</h2>
          <button className="add_btn" onClick={() => navigate("/add_user")}>
            Add User
          </button>
        </div>
        <table className="user-details-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Wifi Plan</th>
              <th>OTT Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u, idx) => (
              <tr key={idx}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.wifi_speed ? `${u.wifi_speed} Mbps` : "-"}</td>
                <td>{u.ott_duration || "-"}</td>
                <td>{u.start_date || "-"}</td>
                <td>{u.end_date || "-"}</td>
                <td>
                  <button className="edit_user_btn" onClick={()=>navigate(`/edit-user/${u.plan_id}`, { state: { userData: u } })}>Edit</button>
                  </td>
                <td>
                  <button className="delete_user_btn">Delete</button>
                  </td>
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
    if (loading) return <LoadingIcon />;
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
              <td>{details.wifi_speed ? `${details.wifi_speed} Mbps` : "-"}</td>
            </tr>
            <tr>
              <th>OTT Plan</th>
              <td>{details.ott_duration || "-"}</td>
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
          headers: user.token ? { Authorization: `Bearer ${user.token}` } : {},
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
      ) : user.isAdmin ? (
        admin_code()
      ) : (
        user_code()
      )}
    </div>
  );
};

export default User;
