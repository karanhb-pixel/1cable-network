import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Edit_User.css";
import LoadingIcon from "../../component/Loading_icon";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/authSlice";
import { selectAllUsers, selectLoading as selectUsersLoading, selectError as selectUsersError, fetchUsers, updateUser } from "../../store/usersSlice";
import { selectWifiPlans, selectOttPlans, fetchWifiPlans, fetchOttPlans } from "../../store/plansSlice";

const EditUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string(),
  first_name: Yup.string(),
  last_name: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  nicename: Yup.string(),
  roles: Yup.string().required("Role is required"),
  password: Yup.string().min(4, "Password too short"), // Optional for editing
  wifi_plan: Yup.string(),
  ott_plan: Yup.string(),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
});

const Edit_User = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming route is /edit-user/:id
  const location = useLocation();
  const propUserData = location.state?.userData;
  const allUsers = useSelector(selectAllUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const wifiPlans = useSelector(selectWifiPlans);
  const ottPlans = useSelector(selectOttPlans);
  const userData = useMemo(() => {
    if (propUserData) return propUserData;
    return allUsers.find(u => u.plan_id === id);
  }, [allUsers, propUserData, id]);

  useEffect(() => {
    dispatch(fetchWifiPlans());
    dispatch(fetchOttPlans());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);
  

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingIcon />
      </div>
    );
  }

  if (!userData) {
    return <div>User data not found.</div>;
  }
  // console.log("userData before setting wifi_plan:", userData);

  const selectedwifiPlan = wifiPlans.find(
    (plan) => plan.speed === userData.wifi_speed
  );

  if (selectedwifiPlan) {
    userData.wifi_plan = selectedwifiPlan.plan_id;
  }
  // console.log("userData after setting wifi_plan:", userData);

  const selectedOttPlan = ottPlans.find(
    (plan) => plan.duration === userData.ott_duration
  );
  if (selectedOttPlan) {
    userData.ott_plan = selectedOttPlan.plan_id;
  }
  // console.log("userData after setting ott_plan:", userData);


  const initialValues = {
    username: userData.username || "",
    name: userData.display_name || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    nicename: userData.nicename || "",
    roles: userData.roles || "",
    password: "", // Leave empty for editing
    wifi_plan: userData.wifi_plan || "",
    ott_plan: userData.ott_plan || "",
    start_date: userData.start_date
      ? new Date(userData.start_date).toISOString().split("T")[0]
      : "",
    end_date: userData.end_date
      ? new Date(userData.end_date).toISOString().split("T")[0]
      : "",
  };
  console.log("Initial Values:", initialValues);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EditUserSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = { ...values };
          if (!payload.password) {
            delete payload.password; // Don't send empty password
          }
          await dispatch(updateUser({ id, data: payload })).unwrap();
          alert(`User updated successfully! Username: ${values.username}`);
          navigate("/user");
        } catch (error) {
          let msg = "An error occurred.";
          if (error.message) {
            msg = error.message;
          }
          alert(`Failed to update user: ${msg}`);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, values }) => {
        const disablePlanFields = values.roles === "administrator";
        return (
          <Form className="edit-user-form">
            <h2 className="edit-user-title">Edit User</h2>
            {error && <div className="form-error">{error}</div>}
            {isSubmitting ? (
              <div className="loading-container">
                <LoadingIcon />
              </div>
            ) : (
              <>
                <div className="edit-user-fields">
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
                    <label htmlFor="nicename">Nickname</label>
                    <Field name="nicename" className="form-input" />
                    <ErrorMessage
                      name="nicename"
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
                    <label htmlFor="password">
                      Password (leave empty to keep current)
                    </label>
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
                      {wifiPlans.length > 0
                        ? wifiPlans.map((plan) => {
                            if (plan.plan_id === "0") return null;
                            return (
                              <option value={plan.plan_id} key={plan.plan_id}>
                                {plan.speed} Mbps
                              </option>
                            );
                          })
                        : null}
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
                      {ottPlans.length > 0
                        ? ottPlans.map((plan) => {
                            if (plan.plan_id === "0") return null;
                            return (
                              <option value={plan.plan_id} key={plan.plan_id}>
                                {plan.duration}
                              </option>
                            );
                          })
                        : null}
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
                <div className="button-group">
                  <button
                    type="submit"
                    className="edit-user-btn"
                    disabled={isSubmitting}
                  >
                    Update User
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate("/user")}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default Edit_User;
