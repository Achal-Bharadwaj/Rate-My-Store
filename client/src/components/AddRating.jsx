import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import StoreFinder from '../apis/StoreFinder';
import { AuthContext } from '../context/AuthContext';

const AddRating = ({ storeId, onRatingAdded }) => {
  const { token } = useContext(AuthContext);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    rating: Yup.number().min(1, 'Must be 1-5').max(5, 'Must be 1-5').required('Required'),
    comment: Yup.string().nullable(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await StoreFinder.post(`/${storeId}/ratings`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRatingAdded();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add rating');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-4">
      <h3 className="mb-3">Add Rating</h3>
      <Formik
        initialValues={{ rating: '', comment: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Rating (1-5)</label>
              <Field name="rating" type="number" className="form-control" min="1" max="5" />
              <ErrorMessage name="rating" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Comment (optional)</label>
              <Field name="comment" as="textarea" className="form-control" />
              <ErrorMessage name="comment" component="div" className="text-danger" />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Submit Rating
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRating;