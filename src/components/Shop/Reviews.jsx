"use client";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase"; // import your Firebase configuration
import { useEffect, useState, memo } from "react";
import useProvideAuth from "../generalUtils/useAuth";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton"; // For skeleton loading

const Reviews = ({ productId, existingReviews = [], rating }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    message: "",
    username: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useProvideAuth();
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  // Fetch reviews for the specific product
  useEffect(() => {
    const fetchReviews = async () => {
      if (existingReviews.length > 0) {
        try {
          const reviewsCollection = collection(firestore, "reviews");
          const reviewsSnapshot = await getDocs(reviewsCollection);
          const reviewsData = reviewsSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((review) => existingReviews.includes(review.id));

          setReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching reviews: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [existingReviews]);

  // Handle new review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const username = user ? user.username : newReview.username;

    if (!username || !newReview.message) return;

    try {
      const reviewRef = await addDoc(collection(firestore, "reviews"), {
        productId,
        username,
        userImage: user ? user.imageUrl || "" : "",
        userRating: newReview.rating,
        userMessage: newReview.message.trim(),
        timestamp: new Date(),
      });

      const productRef = doc(firestore, "products", productId);
      const totalReviews = (existingReviews || []).concat(reviewRef.id);
      const averageRating = await calculateAverageRating(totalReviews);

      await updateDoc(productRef, {
        reviews: totalReviews,
        averageRating,
      });

      setNewReview({ rating: 0, message: "", username: "" });
      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting review: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating from reviews
  const calculateAverageRating = async (totalReviews) => {
    let totalRating = 0; // Initialize totalRating to 0

    // Loop through all reviews and sum the user ratings
    for (const reviewId of totalReviews) {
      const reviewDoc = await getDoc(doc(firestore, "reviews", reviewId));
      if (reviewDoc.exists()) {
        totalRating += reviewDoc.data().userRating || 0;
      }
    }

    // Add the new review's rating to the totalRating
    totalRating += newReview.rating;

    // Calculate the new average by dividing by the total number of reviews (existing + new)
    const newAverageRating = totalRating / (totalReviews.length + 1);

    return newAverageRating.toFixed(2); // Return average as a float, rounded to 2 decimal places
  };

  // Pagination Logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviewsCount = reviews.length;
  const totalPages = Math.ceil(totalReviewsCount / reviewsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      return (
        <FaStar
          key={starIndex}
          onClick={() => setNewReview({ ...newReview, rating: starIndex })}
          onMouseEnter={() => setHoverRating(starIndex)}
          onMouseLeave={() => setHoverRating(0)}
          className={`cursor-pointer text-3xl ${
            starIndex <= (hoverRating || newReview.rating)
              ? "text-yellow-500"
              : "text-gray-300"
          } transition-transform duration-200 ease-in-out transform ${
            hoverRating === starIndex ? "scale-110" : ""
          }`}
        />
      );
    });
  };

  if (loading) {
    return (
      <div>
        <Skeleton height={40} width={"80%"} />
        <Skeleton count={3} height={150} />
      </div>
    );
  }

  return (
    <div className="mt-16 p-2 md:mx-10 max-[520px]:mx-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Reviews (<span className="text-green-500">{totalReviewsCount}</span>)
      </h2>

      {totalReviewsCount === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        currentReviews.map((review) => (
          <div key={review.id} className="border-b py-4 text-gray-800">
            <div className="flex items-center">
              <Image
                src={
                  review.userImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                }
                alt={review.username}
                layout="contained"
                width={50}
                height={50}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="text-gray-800">
                <div className="font-bold">{review.username.charAt(0).toUpperCase() + review.username.slice(1)}</div>
                <div className="flex items-center space-x-1">
                  {[...Array(review.userRating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                  {[...Array(5 - review.userRating)].map((_, i) => (
                    <FaStar key={i} className="text-gray-300" />
                  ))}
                </div>
                <p>{review.userMessage}</p>
                <small className="text-gray-500">
                  {new Date(
                    review.timestamp.seconds * 1000
                  ).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-2 py-1 rounded-md text-white ${
              currentPage === index + 1
                ? "bg-green-600"
                : "bg-gray-400 hover:bg-gray-500"
            } transition`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 text-gray-800">
        <h3 className="text-lg font-bold mb-2">Leave a Review</h3>

        {!user && (
          <div className="mb-4 flex items-center justify-start space-x-3">
            <label className="block mb-1">Your Name:</label>
            <input
              type="text"
              value={newReview.username}
              onChange={(e) =>
                setNewReview({ ...newReview, username: e.target.value })
              }
              className="border border-gray-300 rounded px-2 py-1 mb-2 w-1/4 max-[520px]:w-full"
              required
            />
          </div>
        )}

        <div className="mb-4 flex items-center">
          <label className="block mb-1 mr-2">Rating:</label>
          <div className="flex">{renderStars()}</div>
        </div>

        <label className="block mb-1">Message:</label>
        <textarea
          value={newReview.message}
          onChange={(e) =>
            setNewReview({ ...newReview, message: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
          rows="4"
          required
        />
        <button
          type="submit"
          className={`bg-green-600 text-white px-4 py-2 rounded ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          } transition`}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
        {successMessage && (
          <p className="text-green-500 mt-2">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default memo(Reviews);
