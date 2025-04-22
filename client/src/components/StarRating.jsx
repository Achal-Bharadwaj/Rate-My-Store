import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<span key={i} className="text-warning">★</span>);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<span key={i} className="text-warning">½</span>);
    } else {
      stars.push(<span key={i} className="text-muted">☆</span>);
    }
  }

  return <span>{stars}</span>;
};

export default StarRating;