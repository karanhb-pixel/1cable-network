import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Edit_User.css";
import LoadingIcon from "../../component/Loading_icon";
import axios from "axios";
import { useUser } from "../../utils/useUser";
import "./Edit_User.css";

const EditUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string(),
  first_name: Yup.string(),
  last_name: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  nickname: Yup.string(),
  roles: Yup.string().required("Role is required"),
  password: Yup.string().min(4, "Password too short"), // Optional for editing
  wifi_plan: Yup.string(),
  ott_plan: Yup.string(),
  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
});

const Edit_User = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming route is /edit-user/:id
  const location = useLocation();
  const propUserData = location.state?.userData;
  const [wifiPlans, setWifiPlans] = useState([]);
  const [ottPlans, setOttPlans] = useState([]);
  const [userData, setUserData] = useState(propUserData || null);
  const [loading, setLoading] = useState(!propUserData);

  useEffect(() => {
    const cachedWifiPlans = sessionStorage.getItem("wifi_plans");
    const cachedOttPlans = sessionStorage.getItem("ott_plans");
    if (cachedWifiPlans) {
      setWifiPlans(JSON.parse(cachedWifiPlans));
      // console.log("Using cached WiFi plans.");
    }
    if (cachedOttPlans) {
      setOttPlans(JSON.parse(cachedOttPlans));
      // console.log("Using cached OTT plans.");
    }

    const fetchPlans = async () => {
      try {
        const response_wifi = await fetch(
          `${import.meta.env.VITE_API_ROOT}/wifi-plans`
        );
        const data_wifi = await response_wifi.json();
        const response_ott = await fetch(
          `${import.meta.env.VITE_API_ROOT}/ott-plans`
        );
        const data_ott = await response_ott.json();
        // console.log(data_wifi, "wifi data in edit user");
        // console.log(data_ott, "ott data in edit user");
        setWifiPlans(data_wifi);
        setOttPlans(data_ott);

        if (!response_wifi.ok || !response_ott.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        if (!cachedWifiPlans) setWifiPlans([]);
        if (!cachedOttPlans) setOttPlans([]);
      }
    };

    fetchPlans();
  }, []);
  // console.log(id,"id in edit user");
  
  useEffect(() => {
    if (propUserData && id) {
      // Fetch user data if not provided as props
      const fetchUserData = async () => {
        try {
          let token = "";
          if (user) {
            token = user.token || "";
          }
          const response = await axios.get(
            `${import.meta.env.VITE_API_ROOT}/user-plan/${id}`,
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          alert("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [propUserData, id, user]);

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
          let token = "";
          if (user) {
            token = user.token || "";
          }
          const payload = { ...values };
          if (!payload.password) {
            delete payload.password; // Don't send empty password
          }
          const response = await axios.put(
            `${import.meta.env.VITE_API_ROOT}/user-plan/${id}`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
          );
           
          if (response && response.data && response.data.success) {
            alert(`User updated successfully! Username: ${values.username}`);
          }else if(response && response.data.message === 'No changes detected. Update not performed.'){
              alert('No changes detected. Update not performed.');
               
          } else {
            alert(`User updated, but no confirmation from server.,${response.data}`);
          }
          navigate("/user");
        } catch (error) {
          let msg = "An error occurred.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            msg = error.response.data.error;
          } else if (error.message) {
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
                    <label htmlFor="nickname">Nickname</label>
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
