import LoadingIcon from "../../component/Loading_icon";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';


const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required').min(4),
});


function UserAuth() {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    setError('');
    try {
      // console.log("login values : ", values);
      
      await dispatch(login({ username: values.email, password: values.password })).unwrap();
      navigate('/user');
    } catch (err) {
      setError(err?.message || 'Server error.');
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
