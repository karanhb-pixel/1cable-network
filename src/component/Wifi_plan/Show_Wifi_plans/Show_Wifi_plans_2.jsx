import React, { useEffect, useState, useMemo } from "react";
import PlanCard from "../../PlanCard/PlanCard";
import EditForm from "../../EditCard/EditCard";
import { formatPrice } from "../../../utils/currencyFormatter";
import { useUser } from "../../../utils/useUser";
import LoadingIcon from "../../Loading_icon";
import { useDispatch, useSelector } from "react-redux";
import { fetchWifiPlans, selectWifiPlans, selectPlansLoading } from "../../../store/plansSlice";

export const Show_Wifi_plans_2 = () => {
  const  user  = useUser() ;
  const [isAdmin, setIsAdmin] = useState(false); // Set to true for demonstration
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const dispatch = useDispatch();
  const rawPlans = useSelector(selectWifiPlans);
  const loading = useSelector(selectPlansLoading);
  const formattedPlans = useMemo(() => rawPlans.map((plan) => ({
    plan_id: plan.plan_id,
    speed: Number(plan.speed),
    color: plan.color,
    prices: [
      {
        duration: "6 Month",
        price: formatPrice(plan["6_month"]),
      },
      {
        duration: "12 Month",
        price: formatPrice(plan["12_month"]),
      },
    ],
  })), [rawPlans]);

  useEffect(() => {
    dispatch(fetchWifiPlans());
  }, [dispatch]);

  useEffect(() => {
    const newIsAdmin = user?.user_role.includes('administrator') || false;
    setIsAdmin(newIsAdmin);
    // console.log('isAdmin set to:', newIsAdmin);
    // console.log('user in Show_Wifi_plans_2:', user);
    
  }, [user]);

  useEffect(() => {}, [isEditing]);
  

  // Handle admin plan click
  const handleAdminPlanClick = (plan) => {
    console.log(`Admin clicked to edit plan with speed: ${plan.speed} Mbps`);
    setIsEditing(true);
    setEditingPlan(plan);
  };

  // Handle saving edited plan (mock implementation)
  const handleSavePlan = async (updatedPlan) => {
    console.log("Saving updated plan:", updatedPlan);

    const planToSave = revertFormattedData([updatedPlan]);
    console.log("Plan to save to server:", planToSave);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/wifi-plans`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(planToSave[0]),
      });

      if (!res.ok) {
        throw new Error("Failed to save data on the server.");
      }
      const result = await res.json();
      console.log("Update result:", result);
      dispatch(fetchWifiPlans());
    } catch (error) {
      console.error("Error saving Plan:", error);
      alert("Error saving Plan:", error);
    }
    // console.log("Updated plans after save:", reFormattedPlans);

    setIsEditing(false);
    setEditingPlan(null);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPlan(null);
  };

  //check if editing mode
  if (isEditing) {
    return (
      <EditForm
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
    <>
      <section id="plans" className="plans-section">
        <h2 className="plans-title">HIGH SPEED UNLIMITED PLANS</h2>
        <div className="plans-grid">
          {formattedPlans.map((plan) => {
            if (plan.plan_id === "0") { return null; }
            return (
            <PlanCard
              key={plan.speed}
              plan={plan}
              isAdmin={isAdmin}
              onPlanClick={handleAdminPlanClick}
            />
            );
          })}
        </div>
        {!isAdmin && (
          <>
            <p className="plans-note">NO OTHER CHARGES</p>
            <p className="plans-note text-red text-3xl">Free Installations</p>
          </>
        )}
      </section>
    </>
  );
};

// console.log(formattedData_2(data_2), " formattedData_2 from wifi plan 2");


function revertFormattedData(formattedData) {
  return formattedData.map((plan, index) => {
    // Find the prices for 6 and 12 months.
    const price6Month = plan.prices.find(
      (price) => price.duration === "6 Month"
    );
    const price12Month = plan.prices.find(
      (price) => price.duration === "12 Month"
    );

    return {
      plan_id: plan.plan_id || index + 1,
      speed: String(plan.speed),
      color: plan.color,
      "6_month": price6Month ? price6Month.price : null,
      "12_month": price12Month ? price12Month.price : null,
    };
  });
}
