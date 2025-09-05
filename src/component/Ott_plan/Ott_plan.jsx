import React, { useEffect, useState } from "react";
import PlanCard from '../PlanCard/PlanCard';
import { OttEditCard } from "../EditCard/OttEditCard";
import { formatPrice } from '../../utils/currencyFormatter';
import { useUser } from "../../utils/useUser";
export const Ott_plan = () => {
  {
    /* <!-- OTT Services Section --> */
  }
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
    // console.log(isAdmin + " from ott plan");
    // console.log(user + "user from ott plan");

  }, [user] );

  useEffect(() => {
    // console.log('isEditing changed to:', isEditing);
  }, [isEditing]);
   // Assuming you have user context or prop
  useEffect(() => {
    // Mock data for OTT plans
    const fetchedOttPlans = async () => {
          try {
            const response = await fetch('/ott_plans.json');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
    
            const formattedData = data.map(plan => ({
              ...plan,
              prices: plan.prices.map(priceOption => ({
                ...priceOption,
                price: formatPrice(priceOption.price)
              }))
            }));
            setPlans(formattedData);
            // setIsAdmin(true);
          } catch (error) {
            console.error('Failed to fetch plans:', error);
          }
        };
    fetchedOttPlans();
    // setIsAdmin(true);
  }, []);

  

  const handleAdminPlanClick = (plan) => {
    setEditingPlan(plan);
    setIsEditing(true);
  };

  const handleSavePlan = (updatedPlan) => {
    // console.log('handleSavePlan called with updatedPlan:', updatedPlan);
    // console.log('Current plans:', plans);
    const updatedPlans = plans.map((plan) =>
      plan.duration === updatedPlan.duration ? updatedPlan : plan
    );
    // console.log('Updated plans:', updatedPlans);
    setPlans(updatedPlans);
    setIsEditing(false);
    setEditingPlan(null);
    // console.log('isEditing set to false, editingPlan set to null');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPlan(null);
  };

  if (isEditing) {
    return (
      <OttEditCard
        plan={editingPlan}
        onSave={handleSavePlan}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <section id="ott-services" className="plans-section">
      <h2 className="plans-title">TV - 300 channels</h2>
      <p className="plans-subtitle">280 SD channel + 20 HD channel</p>
      <div className="plans-grid">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            plan={plan}
            isAdmin={isAdmin}
            onPlanClick={handleAdminPlanClick}
          />
        ))}
      </div>
    </section>
  );
};
