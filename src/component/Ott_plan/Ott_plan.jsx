import React, { useEffect, useState } from "react";
import PlanCard from "../PlanCard/PlanCard";
import { OttEditCard } from "../EditCard/OttEditCard";
// import { formatPrice } from "../../utils/currencyFormatter";
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
  }, [user]);

  useEffect(() => {
    // console.log('isEditing changed to:', isEditing);
  }, [isEditing]);
  // Assuming you have user context or prop
  useEffect(() => {
    // Mock data for OTT plans
    const fetchedOttPlans = async () => {
      try {
        const response_2 = await fetch(
          `${import.meta.env.VITE_API_ROOT}/ott-plans`
        );
        // console.log(responce_2, " response from ott plan");

        if (!response_2.ok) {
          throw new Error("Network response was not ok");
        }

        const data_2 = await response_2.json();
        // console.log(data_2, " data_2 from ott plan");
        // Format prices for each plan
        function formatOttPlans_2(data) {
          return data.map((plan) => ({
            plan_id: plan.plan_id,
            duration: plan.duration,
            color: plan.color,
            prices: [
              {
                price: plan.price,
              },
            ],
            // The `bonus` property is conditional.

            ...(plan.bonus && { bonus: plan.bonus }),
          }));
        }

        const reFormattedPlans = formatOttPlans_2(data_2);
        // console.log(reFormattedPlans, "reFormattedData from ott plan");

        setPlans(reFormattedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };
    fetchedOttPlans();
    // setIsAdmin(true);
  }, []);

  const handleAdminPlanClick = (plan) => {
    setEditingPlan(plan);
    setIsEditing(true);
  };

  const handleSavePlan = async (updatedPlan) => {
    // console.log('handleSavePlan called with updatedPlan:', updatedPlan);
    // console.log('Current plans:', plans);
    const updatedPlans = plans.map((plan) =>
      plan.duration === updatedPlan.duration ? updatedPlan : plan
    );

    // console.log("Updated plans:", updatedPlans);
    
    const serverData = revertOttPlans(updatedPlan);
    // console.log("server Data in ott plan : ", serverData);

    // Send update to server
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ROOT}/ott-plans`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(serverData[0]),
      });
      if (!response.ok) {
        throw new Error('Failed to update plan on server');
      }
      const result = await response.json();
      console.log('Update result:', result);
      setPlans(updatedPlans);
    } catch (error) {
      console.error('Error updating plan:', error);
    }

    setIsEditing(false);
    setEditingPlan(null);
    
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPlan(null);
  };

  function revertOttPlans(formattedData) {
  const dataToRevert = Array.isArray(formattedData) ? formattedData : [formattedData];
    return dataToRevert.map((plan) => ({
  
    "plan_id": parseInt(plan.plan_id, 10),
    "duration": plan.duration,
    "color": plan.color,
    "price": plan.prices[0].price,
    "bonus": plan.bonus || null
  }));
  }

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
