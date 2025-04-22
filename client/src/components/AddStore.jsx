import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import StoreFinder from '../apis/StoreFinder';

const AddStore = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    address: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters').required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    address: Yup.string().max(400, 'Address must be at most 400 characters').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await StoreFinder.post('/stores', values);
      navigate('/');
    } catch (err) {
      console.error('Add store error:', err);
      alert('Failed to add store');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Add Store</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <Field type="text" name="address" className="form-control" />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Add Store
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddStore;