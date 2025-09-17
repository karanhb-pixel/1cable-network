import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Edit_User.css";
import LoadingIcon from "../../component/Loading_icon";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/authSlice";
import {
  selectCurrentUser,
  selectLoading as selectUsersLoading,
  selectError as selectUsersError,
  fetchUserById,
  updateUser,
} from "../../store/usersSlice";
import {
  selectWifiPlans,
  selectOttPlans,
  fetchWifiPlans,
  fetchOttPlans,
} from "../../store/plansSlice";

const EditUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string(),
  first_name: Yup.string(),
  last_name: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  nicename: Yup.string(),
  roles: Yup.string().required("Role is required"),
  password: Yup.string().min(4, "Password too short"),
  wifi_plan: Yup.string(),
  ott_plan: Yup.string(),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
});

const Edit_User = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const propUserData = location.state?.userData;
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const wifiPlans = useSelector(selectWifiPlans);
  const ottPlans = useSelector(selectOttPlans);

  const userData = useMemo(() => {
    if (currentUser && Array.isArray(currentUser) && currentUser.length > 0) {
      return currentUser[0];
    }
    if (propUserData) {
      return propUserData;
    }
    return null;
  }, [currentUser, propUserData]);

  useEffect(() => {
    dispatch(fetchWifiPlans());
    dispatch(fetchOttPlans());
  }, [dispatch]);

  useEffect(() => {
    if (user && id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, user, id]);

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

  const initialValues = {
    username: userData.username || "",
    name: userData.display_name || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    nicename: userData.nicename || "",
    roles: userData.roles ? userData.roles : "", // Use the first role
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EditUserSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = { ...values };
          if (!payload.password) {
            delete payload.password;
          }
          // The REST API endpoint now expects the user ID in the URL.
          await dispatch(updateUser({ id, userData: payload })).unwrap();
          alert(`User updated successfully! Username: ${values.username}`);
          navigate("/user");
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred.";
          alert(`Failed to update user: ${errorMessage}`);
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
                    <Field
                      name="roles"
                      as="select"
                      className="form-input"
                      disabled={user && user.roles && user.roles.includes("subscriber")}
                    >
                      <option value="subscriber">Subscriber</option>
                      <option value="administrator">Administrator</option>
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
                      name="wifi_plan"
                      as="select"
                      className="form-input"
                      disabled={disablePlanFields}
                    >
                      <option value="">Select a plan</option>
                      {wifiPlans.map((plan) => (
                        <option key={plan.plan_id} value={plan.plan_id}>
                          {plan.speed} Mbps
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="wifi_plan"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ott_plan">OTT Plan</label>
                    <Field
                      name="ott_plan"
                      as="select"
                      className="form-input"
                      disabled={disablePlanFields}
                    >
                      <option value="">Select a plan</option>
                      {ottPlans.map((plan) => (
                        <option key={plan.plan_id} value={plan.plan_id}>
                          {plan.duration}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="ott_plan"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <Field
                      name="start_date"
                      type="date"
                      className="form-input"
                      disabled={disablePlanFields}
                    />
                    <ErrorMessage
                      name="start_date"
                      component="div"
                      className="form-error"
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
                    <ErrorMessage
                      name="end_date"
                      component="div"
                      className="form-error"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="edit-user-btn"
                >
                  {isSubmitting ? "Updating..." : "Update User"}
                </button>
              </>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default Edit_User;
