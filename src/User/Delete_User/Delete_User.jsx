import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LoadingIcon from "../../component/Loading_icon";
import "./delete_User.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/authSlice";
import {
  selectLoading as selectDeleteLoading,
  selectError as selectDeleteError,
  deleteUser,
} from "../../store/usersSlice";

 const Delete_User = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { userData } = location.state || {};
  const navigate = useNavigate();
  const loading = useSelector(selectDeleteLoading);
  const error = useSelector(selectDeleteError);
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion

  // Redirect after deletion, when loading is false and there's no error
  useEffect(() => {
    if (isDeleting && !loading && !error) {
      navigate("/user");
    }
  }, [isDeleting, loading, error, navigate]);

  const handleDelete = () => {
    if (user && id) {
      // Trigger the deletion process
      setIsDeleting(true);
      dispatch(deleteUser(id));
    }
  };

  const userName = userData ? userData.username : "this user";

  // Display loading icon while deletion is in progress
  if (isDeleting && loading) {
    return (
      <div className="delete_user_section">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="delete_user_section">
      <h2 className="delete_user_title">Delete User</h2>
      <p className="confirmation-text">
        Are you sure you want to delete{" "}
        <span>
          {userName} with ID: {id} ?
        </span>
      </p>
      {error && <p className="error-message">{error}</p>}
      <div className="button-group">
        <button onClick={handleDelete} className="delete-button">
          Confirm Delete
        </button>
        <button onClick={() => navigate(-1)} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Delete_User;