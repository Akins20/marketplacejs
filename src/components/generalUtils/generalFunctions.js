export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};

export const renderStars = (data) => {
  const rating = data.averageRating || 0;
  const maxStars = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(filledStars)].map((_, index) => (
        <span key={index} className="text-yellow-600">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="text-yellow-500">★</span>}
      {[...Array(maxStars - filledStars - (hasHalfStar ? 1 : 0))].map(
        (_, index) => (
          <span key={index} className="text-gray-400 dark:text-gray-600">
            ☆
          </span>
        )
      )}
    </div>
  );
};
