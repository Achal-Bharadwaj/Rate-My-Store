import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import UserFinder from '../apis/UserFinder';
import { AuthContext } from '../context/AuthContext';

const AddUser = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().min(20, 'Must be 20-60 characters').max(60, 'Must be 20-60 characters').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Must be 8-16 characters')
      .max(16, 'Must be 8-16 characters')
      .matches(/[A-Z]/, 'Must include one uppercase')
      .matches(/[!@#$%^&*]/, 'Must include one special character')
      .required('Required'),
    address: Yup.string().max(400, 'Must be under 400 characters').required('Required'),
    role: Yup.string().oneOf(['admin', 'user', 'owner'], 'Invalid role').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await UserFinder.post('/users', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add user');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add User</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '', address: '', role: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="col-md-6 mx-auto">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <Field name="name" type="text" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <Field name="address" type="text" className="form-control" />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <Field as="select" name="role" className="form-select">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-danger" />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              Add User
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddUser;