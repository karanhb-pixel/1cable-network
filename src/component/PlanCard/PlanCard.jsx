import React from 'react';

// --- Start of PlanCard Module ---
const PlanCard = React.memo(({ plan, onPlanClick, isAdmin }) => {
  // Memoize the plan title to avoid recalculation on every render
  const planTitle = React.useMemo(() => {
    return plan.speed ? `${plan.speed} Mbps` : plan.duration;
  }, [plan.speed, plan.duration]);

  // Memoize the plan type to avoid recalculation
  const planType = React.useMemo(() => {
    return plan.speed ? 'Speed Up To' : 'Price';
  }, [plan.speed]);

  // Memoize the click handler to prevent unnecessary re-renders of parent components
  const handleClick = React.useCallback(() => {
    if (isAdmin && onPlanClick) {
      onPlanClick(plan);
    }
  }, [isAdmin, onPlanClick, plan]);

  // Memoize the prices list to avoid re-creating on every render
  const pricesList = React.useMemo(() => {
    return plan.prices.map((priceOption, index) => (
      <li key={index}>
        {plan.speed ? (
          <span>{priceOption.duration}</span>
        ) : (
          <span>{plan.duration}</span>
        )}
        <span className="plan-price">{priceOption.price}</span>
      </li>
    ));
  }, [plan.prices, plan.speed, plan.duration]);

  // Memoize the bonus item
  const bonusItem = React.useMemo(() => {
    if (!plan.bonus) return null;
    return (
      <li className="plan-bonus">
        <span className="text-red-500">{plan.bonus}</span>
      </li>
    );
  }, [plan.bonus]);

  return (
    <div
      className={`plan-card relative ${isAdmin ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <h3 className={`plan-title text-${plan.color}`}>{planTitle}</h3>
      <p className="plan-speed">{planType}</p>
      <ul className="plan-list">
        {pricesList}
        {bonusItem}
      </ul>
      {isAdmin && (
        <span className="edit-note">
          Click to Edit
        </span>
      )}
    </div>
  );
});

PlanCard.displayName = 'PlanCard';

export default PlanCard;
// --- End of PlanCard Module ---
