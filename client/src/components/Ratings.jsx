import React from 'react';

const Ratings = ({ ratings }) => {
  return (
    <div className="mt-4">
      <h3 className="mb-3">Ratings</h3>
      <div className="row">
        {ratings.map(rating => (
          <div key={rating.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{rating.user_name}</h5>
                <p className="card-text">Rating: {rating.rating}/5</p>
                <p className="card-text">{rating.comment || 'No comment'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ratings;