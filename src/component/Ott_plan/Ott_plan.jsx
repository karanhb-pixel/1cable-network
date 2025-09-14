import React, { useEffect, useState, useMemo } from "react";
import PlanCard from "../PlanCard/PlanCard";
import { OttEditCard } from "../EditCard/OttEditCard";
import { useUser } from "../../utils/useUser";
import LoadingIcon from "../Loading_icon";
import { useDispatch, useSelector } from "react-redux";
import { fetchOttPlans, selectOttPlans, selectPlansLoading } from "../../store/plansSlice";
export const Ott_plan = () => {
  {
    /* <!-- OTT Services Section --> */
  }
  const { user } = useUser() || {};
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const dispatch = useDispatch();
  const rawPlans = useSelector(selectOttPlans);
  const loading = useSelector(selectPlansLoading);
  const formattedPlans = useMemo(() => formatOttPlans_2(rawPlans), [rawPlans]);

  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  useEffect(() => {}, [isEditing]);

  useEffect(() => {
    dispatch(fetchOttPlans());
  }, [dispatch]);


  const handleAdminPlanClick = (plan) => {
    setEditingPlan(plan);
    setIsEditing(true);
  };

  const handleSavePlan = async (updatedPlan) => {
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
      dispatch(fetchOttPlans());
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
        {formattedPlans.map((plan, index) =>{
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