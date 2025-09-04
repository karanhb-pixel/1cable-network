// import './PlanCard.css';

// --- Start of PlanCard Module ---
const PlanCard = ({ plan, onPlanClick, isAdmin }) => {
  return (
    <div
      className={`plan-card relative ${isAdmin ? 'cursor-pointer' : ''}`}
      onClick={() => isAdmin && onPlanClick(plan)}
    >
      <h3 className={`plan-title text-${plan.color}`}>{plan.speed ? `${plan.speed} Mbps` : `${plan.duration}`}</h3>
      <p className="plan-speed">{plan.speed ? 'Speed Up To' : 'Price'}</p>
      <ul className="plan-list">
        {plan.prices.map((priceOption, index) => (
          <li key={index}>
            {plan.speed ? (<span className="">{priceOption.duration}</span>):(<span className="">{plan.duration}</span>)}
            <span className="plan-price">{priceOption.price}</span>
          </li>
        ))}
        {plan.bonus && (
          <li className="plan-bonus">
            <span className="text-red-500">{plan.bonus}</span>
          </li>
        )}
      </ul>
      {isAdmin && (
        <span className="edit-note">
          Click to Edit
        </span>
      )}
    </div>
  );
};

export default PlanCard;
// --- End of PlanCard Module ---
