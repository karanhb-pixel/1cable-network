
import React, { useEffect, useState } from 'react'
import PlanCard from '../../PlanCard/PlanCard';
import EditForm from '../../EditCard/EditCard';
import {  formatPrice } from '../../../utils/currencyFormatter';
import { useUser } from "../../../useUser";


export const Show_Wifi_plans_2 = () => {

  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Set to true for demonstration
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

    useEffect(() => {
    // Fetch the JSON file from the public directory
    const fetchPlans = async () => {
      try {
        const response = await fetch('/wifi_plans.json');
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

    
    fetchPlans();
  }, []);

  useEffect(() => {
    const newIsAdmin = user?.isAdmin || false;
    setIsAdmin(newIsAdmin);
    // console.log(user?.isAdmin , " from wifi plan 2");
    // console.log(user , "user from wifi plan 2");
  },[user]);

    // Handle admin plan click
   const handleAdminPlanClick = (plan) => {
    console.log(`Admin clicked to edit plan with speed: ${plan.speed} Mbps`);
    setIsEditing(true);
    setEditingPlan(plan);
  };

  // Handle saving edited plan (mock implementation)
  const handleSavePlan = (updatedPlan) => {
    console.log('Saving updated plan:', updatedPlan);
    const updatedPlans = plans.map(plan => 
      plan.speed === updatedPlan.speed ? updatedPlan : plan
    );
    // You need to re-format the price for display after saving
    const reFormattedPlans = updatedPlans.map(plan => ({
      ...plan,
      prices: plan.prices.map(priceItem => ({
        ...priceItem,
        price: formatPrice(priceItem.price),
      })),
    }));
    setPlans(reFormattedPlans);
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
        </div>{!isAdmin && (<>
        <p className="plans-note">NO OTHER CHARGES</p>
          <p className="plans-note text-red text-3xl">Free Installations</p>
          </>)
          }
      
      </section>
    </>
  );

}
