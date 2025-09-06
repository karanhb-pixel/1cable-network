import React, { useEffect, useState } from "react";
import PlanCard from "../../PlanCard/PlanCard";
import EditForm from "../../EditCard/EditCard";
import { formatPrice } from "../../../utils/currencyFormatter";
import { useUser } from "../../../utils/useUser";
import LoadingIcon from "../../Loading_icon";

export const Show_Wifi_plans_2 = () => {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Set to true for demonstration
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const newIsAdmin = user?.isAdmin || false;
    setIsAdmin(newIsAdmin);
  }, [user]);

  useEffect(() => {}, [isEditing]);
  
  // Fetch WiFi plans with caching
  const fetchPlans = async () => {
    console.log("Starting to fetch WiFi plans...");
    setLoading(true);

    // 1. Check if cached data exists
    const cachedPlans = sessionStorage.getItem("wifi_plans");
    if (cachedPlans) {
      setPlans(JSON.parse(cachedPlans));
      console.log("Using cached WiFi plans.");
    }

    try {
      // 2. Fetch the latest plans from the server
      const response_2 = await fetch(
        `${import.meta.env.VITE_API_ROOT}/wifi-plans`
      );
      if (!response_2.ok) {
        throw new Error("Network response was not ok");
      }
      const data_2 = await response_2.json();
      const newPlans = formattedData_2(data_2);

      // 3. Update the state with the fresh data and cache it
      setPlans(newPlans);
      sessionStorage.setItem("wifi_plans", JSON.stringify(newPlans));
      // setIsAdmin(true);
      console.log("New WiFi plans fetched and cached successfully.");
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      // If fetch fails and there's no cached data, display a message
      if (!cachedPlans) {
        setPlans([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle admin plan click
  const handleAdminPlanClick = (plan) => {
    console.log(`Admin clicked to edit plan with speed: ${plan.speed} Mbps`);
    setIsEditing(true);
    setEditingPlan(plan);
  };

  // Handle saving edited plan (mock implementation)
  const handleSavePlan = async (updatedPlan) => {
    // console.log("Saving updated plan:", updatedPlan);
    const updatedPlans = plans.map((plan) =>
      plan.speed === updatedPlan.speed ? updatedPlan : plan
    );

    // You need to re-format the price for display after saving
    const reFormattedPlans = updatedPlans.map((plan) => ({
      ...plan,
      prices: plan.prices.map((priceItem) => ({
        ...priceItem,
        price: formatPrice(priceItem.price),
      })),
    }));
    // you need to re-format the price for server
    const revertedPlans = revertFormattedData(reFormattedPlans);
    // console.log("Reverted plans for saving to server:", revertedPlans);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_ROOT}/wifi-plans`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(revertedPlans[0]),
      });

      if (!res.ok) {
        throw new Error("Failed to save data on the server.");
      }
      const result = await res.json();
      console.log("Update result:", result);
      setPlans(reFormattedPlans);
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
          {plans.map((plan) => (
            <PlanCard
              key={plan.speed}
              plan={plan}
              isAdmin={isAdmin}
              onPlanClick={handleAdminPlanClick}
            />
          ))}
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

function formattedData_2(data) {
  return data.map((plan) => ({
    plan_id: plan.plan_id,
    speed: Number(plan.speed),
    color: plan.color,
    prices: [
      {
        duration: "6 Month",
        price: plan["6_month"],
      },
      {
        duration: "12 Month",
        price: plan["12_month"],
      },
    ],
  }));
}
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
