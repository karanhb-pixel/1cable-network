import React from 'react';
import { Formik, useFormik, FieldArray, Form } from 'formik';
import * as Yup from 'yup';
import './EditCard.css';
import { useState } from 'react';


// The Yup validation schema
const validationSchema = Yup.object({
  speed: Yup.number()
    .required('Speed is required.')
    .positive('Speed must be a positive number.')
    .integer('Speed must be an integer.'),
  prices: Yup.array().of(
    Yup.object().shape({
      price: Yup.string().trim().required('Price cannot be empty.'),
    })
  )
});

const extractNumericPrice = (priceString) => {
  if (typeof priceString !== 'string') {
    return '';
  }
  return priceString.replace(/[^0-9]/g, '');
};

const EditForm = ({ plan, onSave, onCancel }) => {

//static plan for formik initial values
const staticPlan = {
    ...plan,
    prices: plan.prices.map((priceItem, index) => ({
      ...priceItem,
      duration: index === 0 ? '6 Months' : '12 Months',
      price: extractNumericPrice(priceItem.price),
    })),
  };

  return (
    <Formik
      initialValues={staticPlan}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const formattedValues = {
          ...values,
          prices: values.prices.map(priceItem => ({
            ...priceItem,
            price: `₹${priceItem.price}/-`
          }))
        };
        onSave(values);
      }}
    >
      {({ isSubmitting, touched, errors, values, handleBlur, handleChange }) => (
        <div className="edit-form-container">
          <div className="edit-form-card">
            <h1 className="edit-form-title">Edit {plan.speed} Mbps Plan</h1>
            <Form>
              <div className="form-field-group">
                <label className="form-label" htmlFor="speed">Speed (Mbps):</label>
                <input
                  type="number"
                  id="speed"
                  name="speed"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.speed}
                  className="form-input"
                />
                {touched.speed && errors.speed && (
                  <p className="error-message">{errors.speed}</p>
                )}
              </div>
              
              <FieldArray name="prices">
                {() => (
                  <div>
                    {values.prices.map((price, index) => (
                      <div key={index} className="price-option-group">
                        <label className="form-label">{price.duration}:</label>
                        <FormattedPriceInput
                            name={`prices.${index}.price`}
                            value={values.prices[index].price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g., 3100"
                        />
                        {touched.prices?.[index]?.price && errors.prices?.[index]?.price && (
                          <p className="error-message">{errors.prices[index].price}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>

              <div className="button-group">
                <button
                  type="button"
                  onClick={onCancel}
                  className="button cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button save-button"
                  disabled={isSubmitting}
                >
                  Save Changes
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default EditForm;


// New component for the formatted price input
const FormattedPriceInput = ({ name, value, onChange, onBlur, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlurWithFormik = (e) => {
        setIsFocused(false);
        onBlur(e);
    };

    const displayValue = isFocused ? value : `₹${value}/-`;

    return (
        <input
            type="text"
            inputMode="numeric"
            name={name}
            onChange={onChange}
            onBlur={handleBlurWithFormik}
            onFocus={handleFocus}
            value={displayValue}
            placeholder={placeholder}
            className="form-input"
        />
    );
};