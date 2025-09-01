import LoadingIcon from "../component/Loading_icon";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';


const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required').min(4),
});


function UserAuth({ onAuthSuccess }) {
  const [error, setError] = useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    setError('');
    try {
      // Use correct env variable access for Vite
      const endpoint = import.meta.env.VITE_API_AUTH_TOKEN;
      const response = await axios.post(endpoint, {
        username: values.email,
        password: values.password
      });
      // You may want to check response.data for success
      if (response.data && response.data.token) {
        setError('');
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Check user_role and handle accordingly
        const userRole = response.data.user_role;
        if (userRole === 'administrator') {
          
          // Handle admin login (e.g., redirect, show admin UI, etc.)
          onAuthSuccess({ ...response.data, isAdmin: true });
        } else if (userRole === 'subscriber') {
         
          // Handle regular user login
          onAuthSuccess({ ...response.data, isAdmin: false });
        } else {
          setError('Unauthorized role.');
        }
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error.');
      }
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting }) => (
        <Form className="user-auth-form">
          <h1>User Login</h1>
          {isSubmitting ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}><LoadingIcon /></div>
          ) : (
            <>
              <div>
                <label htmlFor="email">Email:</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit" disabled={isSubmitting}>Login</button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default UserAuth;
