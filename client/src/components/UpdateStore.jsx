import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import StoreFinder from '../apis/StoreFinder';
import { AuthContext } from '../context/AuthContext';

const UpdateStore = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await StoreFinder.get(`/${id}`);
        const { name, email, address } = response.data.data.store;
        setInitialValues({ name, email, address });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch store');
      }
    };
    fetchStore();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().min(20, 'Must be 20-60 characters').max(60, 'Must be 20-60 characters').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    address: Yup.string().max(400, 'Must be under 400 characters').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await StoreFinder.put(`/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/stores/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update store');
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Update Store</h2>
      <Formik
        enableReinitialize
        initialValues={initialValues}
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
              <label htmlFor="address" className="form-label">Address</label>
              <Field name="address" type="text" className="form-control" />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              Update Store
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateStore;