import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthFinder from '../apis/AuthFinder';
import { AuthContext } from '../context/AuthContext';

const PasswordUpdate = () => {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Required'),
    newPassword: Yup.string()
      .min(8, 'Must be 8-16 characters')
      .max(16, 'Must be 8-16 characters')
      .matches(/[A-Z]/, 'Must include one uppercase')
      .matches(/[!@#$%^&*]/, 'Must include one special character')
      .required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await AuthFinder.put('/users/password', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Password updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Update failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Update Password</h2>
      <Formik
        initialValues={{ oldPassword: '', newPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="col-md-6 mx-auto">
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <Field name="oldPassword" type="password" className="form-control" />
              <ErrorMessage name="oldPassword" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <Field name="newPassword" type="password" className="form-control" />
              <ErrorMessage name="newPassword" component="div" className="text-danger" />
            </div>
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              Update
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordUpdate;