import React, { useEffect, useState } from "react";
import PlanCard from "../PlanCard/PlanCard";
import { OttEditCard } from "../EditCard/OttEditCard";
import { useUser } from "../../utils/useUser";
import LoadingIcon from "../Loading_icon";
export const Ott_plan = () => {
  {
    /* <!-- OTT Services Section --> */
  }
  const { user } = useUser() || {};
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  useEffect(() => {}, [isEditing]);

  useEffect(() => {
    fetchedOttPlans();
  }, []);

  const fetchedOttPlans = async () => {
    // console.log("Starting to fetch OTT plans...");
    setLoading(true);

    // 1. Check for cached data in sessionStorage
    const cachedPlans = sessionStorage.getItem("ott_plans");
    if (cachedPlans) {
      setPlans(JSON.parse(cachedPlans));
      console.log("Using cached OTT plans.");
    }

    try {
      //fetching latest data from server
      const response_2 = await fetch(
        `${import.meta.env.VITE_API_ROOT}/ott-plans`
      );

      if (!response_2.ok) {
        throw new Error("Network response was not ok");
      }

      const data_2 = await response_2.json();
      // Format prices for each plan

      const reFormattedPlans = formatOttPlans_2(data_2);
      // console.log(reFormattedPlans, "reFormattedData from ott plan");
      setPlans(reFormattedPlans);
      sessionStorage.setItem("ott_plans", JSON.stringify(reFormattedPlans));
      // console.log("New OTT plans fetched and cached successfully.");
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      if (!cachedPlans) {
        setPlans([]);
      }
    } finally {
      setLoading(false);
      console.log("Fetch operation completed.");
    }
  };

  const handleAdminPlanClick = (plan) => {
    setEditingPlan(plan);
    setIsEditing(true);
  };

  const handleSavePlan = async (updatedPlan) => {
    const updatedPlans = plans.map((plan) =>
      plan.duration === updatedPlan.duration ? updatedPlan : plan
    );

    const serverData = revertOttPlans(updatedPlan);

    // Send update to server
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}/ott-plans`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(serverData[0]),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update plan on server");
      }
      const result = await response.json();
      console.log("Update result:", result);
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error updating plan:", error);
    }

    setIsEditing(false);
    setEditingPlan(null);
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

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <section id="ott-services" className="plans-section">
      <h2 className="plans-title">TV - 300 channels</h2>
      <p className="plans-subtitle">280 SD channel + 20 HD channel</p>
      <div className="plans-grid">
        {plans.map((plan, index) =>{ 
        if (plan.plan_id === "0") { return null; }
        return(
          <PlanCard
            key={index}
            plan={plan}
            isAdmin={isAdmin}
            onPlanClick={handleAdminPlanClick}
          />
        );
        })}
      </div>
    </section>
  );
};


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
  function revertOttPlans(formattedData) {
    const dataToRevert = Array.isArray(formattedData)
      ? formattedData
      : [formattedData];
    return dataToRevert.map((plan) => ({
      plan_id: parseInt(plan.plan_id, 10),
      duration: plan.duration,
      color: plan.color,
      price: plan.prices[0].price,
      bonus: plan.bonus || null,
    }));
  }