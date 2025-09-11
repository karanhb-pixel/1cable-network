import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import LoadingIcon from '../../component/Loading_icon';
import "./delete_User.css"
// import
export const Delete_User = () => {
  const { id } = useParams();
  const location = useLocation();
  const {userData} = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const requestData = userData ? userData : "unknown";
    try {
      const token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(`${import.meta.env.VITE_API_ROOT}/delete-user/${id}`, { headers: headers,
          data: requestData  });

      if (response.status === 200) {
        setSuccess('User deleted successfully.');
        setTimeout(() => navigate('/user'), 2000); // Navigate back to users list after 2 seconds
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the user.');
    } finally {
      setLoading(false);
    }
  };
  console.log(userData);
  
  const userName = userData ? userData.username : "this user";

  return (
    <div className='delete_user_section'>
      <h2 className='delete_user_title'>Delete User</h2>
      <p className='confirmation-text'>Are you sure you want to delete <span>{userName} with ID: {id} ?</span></p>
      {error && <p className='error-message'>{error}</p>}
      {success && <p className='success-message'>{success}</p>}
      <div className="button-group">
        <button onClick={handleDelete} disabled={loading} className={`delete-button ${loading ? 'loading' : ''}`}>
          {loading ? <LoadingIcon /> : null}
          {loading ? 'Deleting...' : 'Confirm Delete'}
        </button>
        <button onClick={() => navigate(-1)} disabled={loading} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};
