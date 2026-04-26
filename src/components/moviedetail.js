import React, { useEffect, useState } from 'react';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('5');
  const [submitMessage, setSubmitMessage] = useState('');


  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleSubmitReview = (event) => {
    event.preventDefault();
    if (!reviewText.trim()) {
      setSubmitMessage('Please enter a review comment.');
      return;
    }
    dispatch(submitReview(movieId, reviewText.trim(), rating))
      .then(() => {
        setReviewText('');
        setRating('5');
        setSubmitMessage('Review submitted.');
      })
      .catch(() => {
        setSubmitMessage('Unable to submit review.');
      });
  };

  if (loading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedMovie) {
    return <div>No movie data available.</div>;
  }

  const actors = selectedMovie.actors || [];
  const reviews = selectedMovie.reviews || selectedMovie.movieReviews || [];

  return (
    <Card className="bg-dark text-dark p-4 rounded">
      <Card.Header className="text-white">Movie Detail</Card.Header>
      <Card.Body>
        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
      </Card.Body>
      <ListGroup>
        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
        <ListGroupItem>
          {actors.map((actor, i) => (
            <p key={i}>
              <b>{actor.actorName}</b> {actor.characterName}
            </p>
          ))}
        </ListGroupItem>
        <ListGroupItem>
          <h4>
            <BsStarFill /> {selectedMovie.avgRating}
          </h4>
        </ListGroupItem>
      </ListGroup>
      <Card.Body className="card-body bg-white">
        <h5>Write a review</h5>
        <Form onSubmit={handleSubmitReview}>
          <Form.Group className="mb-2" controlId="reviewRating">
            <Form.Label>Rating</Form.Label>
            <Form.Select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2" controlId="reviewComment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="mb-2">Submit Review</Button>
        </Form>
        {submitMessage && <p>{submitMessage}</p>}
        <hr />
        <h5>Reviews</h5>
        {reviews.map((review, i) => (
          <p key={i}>
            <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
            {review.rating}
          </p>
        ))}
      </Card.Body>
    </Card>
  );
};


export default MovieDetail;
