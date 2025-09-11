import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./add_User.css";
import LoadingIcon from "../../component/Loading_icon";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/authSlice";
import { selectWifiPlans, selectOttPlans, fetchWifiPlans, fetchOttPlans } from "../../store/plansSlice";
import { selectError as selectUsersError, addUser } from "../../store/usersSlice";

const AddUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string(),
  first_name: Yup.string(),
  last_name: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  nickname: Yup.string(),
  roles: Yup.string().required("Role is required"),
  password: Yup.string()
    .min(4, "Password too short")
    .required("Password is required"),
  wifi_plan: Yup.string(),
  ott_plan: Yup.string(),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
});

const Add_User = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wifiPlans = useSelector(selectWifiPlans);
  const ottPlans = useSelector(selectOttPlans);
  const error = useSelector(selectUsersError);
  
  useEffect(() => {
    dispatch(fetchWifiPlans());
    dispatch(fetchOttPlans());
  }, [dispatch]);

  return (
    <Formik
      initialValues={{
        username: "",
        name: "",
        first_name: "",
        last_name: "",
        email: "",
        nickname: "",
        roles: "",
        password: "",
        wifi_plan: "",
        ott_plan: "",
        start_date: "",
        end_date: "",
      }}
      validationSchema={AddUserSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await dispatch(addUser(values)).unwrap();
          resetForm();
          alert(`User created successfully! Username: ${values.username}`);
          navigate("/user");
        } catch (error) {
          let msg = "An error occurred.";
          if (error.message) {
            msg = error.message;
          }
          alert(`Failed to create user: ${msg}`);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, values }) => {
        const disablePlanFields = values.roles === "administrator";
        return (
          <Form className="add-user-form">
            <h2 className="add-user-title">Add User</h2>
            {error && <div className="form-error">{error}</div>}
            {isSubmitting ? (
              <div className="loading-container">
                <LoadingIcon />
              </div>
            ) : (
              <>
                <div className="add-user-fields">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Field name="username" className="form-input" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Display Name</label>
                    <Field name="name" className="form-input" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <Field name="first_name" className="form-input" />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <Field name="last_name" className="form-input" />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-input" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nickname">Nickname</label>
                    <Field name="nickname" className="form-input" />
                    <ErrorMessage
                      name="nickname"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="roles">Role</label>
                    <Field as="select" name="roles" className="form-input">
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="administrator">Administrator</option>
                      <option value="subscriber">User</option>
                    </Field>
                    <ErrorMessage
                      name="roles"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="wifi_plan">Wifi Plan</label>
                    <Field
                      as="select"
                      name="wifi_plan"
                      className="form-input"
                      disabled={disablePlanFields}
                    >
                      <option value="" disabled>
                        Select Wifi Plan
                      </option>
                      {wifiPlans.length > 0 ? (
                        wifiPlans.map((plan)=>{
                          if (plan.plan_id === "0") { return null; }
                          return <option value={plan.plan_id} key={plan.plan_id}>{plan.speed} Mbps</option>
                      })): null}
                      
                      <option value="0">None</option>
                    </Field>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ott_plan">OTT Plan</label>
                    <Field
                      as="select"
                      name="ott_plan"
                      className="form-input"
                      disabled={disablePlanFields}
                    >
                      <option value="" disabled>
                        Select OTT Plan
                      </option>
                      {ottPlans.length > 0 ? (
                        ottPlans.map((plan)=>{
                          if (plan.plan_id === "0") { return null; }
                          return <option value={plan.plan_id} key={plan.plan_id}>{plan.duration}</option>
                      })): null}
                     
                      <option value="0">None</option>
                    </Field>
                  </div>
                  <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <Field
                      name="start_date"
                      type="date"
                      className="form-input"
                      disabled={disablePlanFields}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end_date">End Date</label>
                    <Field
                      name="end_date"
                      type="date"
                      className="form-input"
                      disabled={disablePlanFields}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="add-user-btn"
                  disabled={isSubmitting}
                >
                  Add User
                </button>
              </>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default Add_User;
