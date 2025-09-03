// import './PlanCard.css';

// --- Start of PlanCard Module ---
const PlanCard = ({ plan, onPlanClick, isAdmin }) => {
  return (
    <div
      className={`plan-card relative ${isAdmin ? "cursor-pointer" : ""}`}
      onClick={() => isAdmin && onPlanClick(plan)}
    >
      <h3 className={`plan-title text-${plan.color}`}>{plan.speed} Mbps</h3>
      <p className="plan-speed">Speed Up To</p>
      <div className="plan-prices">
        {plan.prices.map((priceOption, index) => (
          <div key={index} className="price-option">
            <span className="price-duration">{priceOption.duration}</span>
            {/* Display the formatted price directly */}
            <span className="price-value">{priceOption.price}</span>
          </div>
        ))}
      </div>
      {isAdmin && (
        <>
          <span className="edit-note text-red">Click to Edit</span>
          <p className="plans-note">NO OTHER CHARGES</p>
          <p className="plans-note text-red text-3xl">Free Installations</p>
        </>
      )}
    </div>
  );
};

export default PlanCard;
// --- End of PlanCard Module ---
