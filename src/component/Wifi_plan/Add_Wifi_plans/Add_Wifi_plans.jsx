
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './add_Wifi_plans.css';

const WifiPlanSchema = Yup.object().shape({
  plan_title: Yup.string().required('Plan title is required'),
  plan_speed: Yup.string().required('Plan speed is required'),
  price_6months: Yup.number().typeError('Enter a valid price').required('Price for 6 months is required'),
  price_12months: Yup.number().typeError('Enter a valid price').required('Price for 12 months is required'),
});

export const Add_Wifi_plans = () => {
  // Placeholder for submit handler (replace with API call as needed)
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // TODO: Replace with API call to add/modify plan
    alert('Plan submitted: ' + JSON.stringify(values, null, 2));
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className="wifi-plan-form-container">
      <h2>Add or Modify Wifi Plan</h2>
      <Formik
        initialValues={{
          plan_title: '',
          plan_speed: '',
          price_6months: '',
          price_12months: '',
        }}
        validationSchema={WifiPlanSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="wifi-plan-form">
            <div className="form-group">
              <label htmlFor="plan_title">Plan Title</label>
              <Field name="plan_title" className="form-input" />
              <ErrorMessage name="plan_title" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="plan_speed">Plan Speed</label>
              <Field name="plan_speed" className="form-input" />
              <ErrorMessage name="plan_speed" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="price_6months">Price (6 Months)</label>
              <Field name="price_6months" className="form-input" />
              <ErrorMessage name="price_6months" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="price_12months">Price (12 Months)</label>
              <Field name="price_12months" className="form-input" />
              <ErrorMessage name="price_12months" component="div" className="form-error" />
            </div>
            <button type="submit" className="wifi-plan-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Plan'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
