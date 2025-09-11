import React, { useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import LoadingIcon from '../../component/Loading_icon';
import "./delete_User.css"
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/authSlice";
import { selectLoading as selectDeleteLoading, selectError as selectDeleteError, deleteUser } from "../../store/usersSlice";
// import
export const Delete_User = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const {userData} = location.state || {};
  const navigate = useNavigate();
  const loading = useSelector(selectDeleteLoading);
  const error = useSelector(selectDeleteError);


  useEffect(() => {
    if (user && id) {
      dispatch(deleteUser({ id, data: userData }));
    }
  }, [dispatch, user, id, userData]);

  useEffect(() => {
    if (error) {
      alert(`Failed to delete user: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !error) {
      navigate('/user');
    }
  }, [loading, error, navigate]);
  
  const userName = userData ? userData.username : "this user";

  if (loading) {
    return (
      <div className='delete_user_section'>
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className='delete_user_section'>
      <h2 className='delete_user_title'>Delete User</h2>
      <p className='confirmation-text'>Are you sure you want to delete <span>{userName} with ID: {id} ?</span></p>
      {error && <p className='error-message'>{error}</p>}
      <div className="button-group">
        <button onClick={() => dispatch(deleteUser({ id, data: userData }))} className="delete-button">
          Confirm Delete
        </button>
        <button onClick={() => navigate(-1)} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};
