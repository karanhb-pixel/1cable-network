import "./user.css";
import UserAuth from "../UserAuth/UserAuth";
import { useEffect } from "react";
import LoadingIcon from "../../component/Loading_icon";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../store/authSlice";
import { selectAllUsers, selectLoading as selectUsersLoading, selectError as selectUsersError, fetchUsers } from "../../store/usersSlice";
import { useNavigate } from "react-router-dom";
import Add_User from "../Add_User/Add_User";

const User = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const navigate = useNavigate();
  const admin_code = () => {
    if (loading) return <LoadingIcon />;
    if (error) return <div>Error loading users: {error}</div>;

    
    
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
                  <button className="delete_user_btn" onClick={()=>navigate(`/delete-user/${u.plan_id}`,{state: {userData: u}})}>Delete</button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="logout-btn user-logout-btn"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </div>
    );
  };

  const user_code = () => {
    if (loading) return <LoadingIcon />;
    if (error) return <div>Error loading user details: {error}</div>;
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
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  return (
    <div className="user-page">
      {!user ? (
        <UserAuth  />
      ) : user.user_role === "administrator" ? (
        admin_code()
      ) : (
        user_code()
      )}
    </div>
  );
};

export default User;
