import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthFinder from '../apis/AuthFinder';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const { login } = useContext(AuthContext);
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
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await AuthFinder.post('/signup', values);
      login(response.data.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signup</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '', address: '' }}
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
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              Signup
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;