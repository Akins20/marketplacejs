const PromotionInfo = ({ promotion }) => {
  if (!promotion || promotion.discountPercentage === 0) {
    return <p className="text-gray-600">No promotion available</p>;
  }

  return (
    <div className="promotion-info text-green-600">
      <p>
        {promotion.discountPercentage}% off on up to{" "}
        {promotion.maxDiscountedItems} items
      </p>
    </div>
  );
};

export default PromotionInfo;
