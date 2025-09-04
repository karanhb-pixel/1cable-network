import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./EditCard.css";

// Utility function to extract numeric value from price string
const extractNumericPrice = (priceString) => {
  if (typeof priceString !== "string") {
    return "";
  }
  return priceString.replace(/[^0-9]/g, "");
};

// --- Start of OttEditForm Component (For OTT Plans) ---
export const OttEditCard = ({ plan, onSave, onCancel }) => {
  const validationSchema = Yup.object().shape({
    duration: Yup.string().trim().required("Duration is required."),
    prices: Yup.array().of(
      Yup.object().shape({
        price: Yup.string().trim().required("Price is required."),
      })
    ),
    bonus: Yup.string().optional(),
  });
  // console.log(plan, "plan from ott edit form");
  //static plan for formik initial values
  const staticPlan = {
    ...plan,
    prices: plan.prices.map((priceItem) => ({
      ...priceItem,
      price: extractNumericPrice(priceItem.price),
    })),
  };
  // console.log(staticPlan, 'static plan');

  return (
    <Formik
      initialValues={staticPlan}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // console.log('OttEditCard onSubmit called with values:', values);
        const formattedValues = {
          ...values,
          prices: values.prices.map((priceItem) => ({
            ...priceItem,
            price: `₹${priceItem.price}/-`,
          })),
        };
        // console.log('Calling onSave with formattedValues:', formattedValues);
        onSave(formattedValues);
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleBlur,
        handleChange,
      }) => (
        <div className="edit-form-container">
          <div className="edit-form-card">
            <h1 className="edit-form-title">Edit OTT Plan</h1>
            <Form>
              <div className="form-field-group">
                <label className="form-label">Duration</label>
                <Field
                  type="text"
                  name="duration"
                  readOnly
                  className="form-input"
                />
              </div>

              <FieldArray name="prices">
                {() => (
                  <div>
                    {values.prices.map((price, index) => (
                      <div key={index} className="price-option-group">
                        <label className="form-label">Price</label>
                        <FormattedPriceInput
                          name={`prices.${index}.price`}
                          value={values.prices[index].price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g., 3100"
                        />
                        {touched.prices?.[index]?.price &&
                          errors.prices?.[index]?.price && (
                            <p className="error-message">
                              {errors.prices[index].price}
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
              <div className="form-field-group">
                <label className="form-label">Bonus</label>
                <Field
                  type="text"
                  name="bonus"
                  className="form-input text-red"
                />
              </div>
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

// New component for the formatted price input
const FormattedPriceInput = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
}) => {
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
