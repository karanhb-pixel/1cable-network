import React from "react";
import '../../app.css';
export const Show_Wifi_plans = () => {
  return (
    <>
      {/* <!-- Plans Section --> */}
      <section id="plans" className="plans-section">
        <h2 className="plans-title">HIGH SPEED UNLIMITED PLANS</h2>
        <div className="plans-grid">
          {/* 50 Mbps Plan */}
          <div className="plan-card">
            <h3 className="plan-title text-red">50 Mbps</h3>
            <p className="plan-speed">Speed Up To</p>
            <ul className="plan-list">
              <li>
                <span>6 Month</span>
                <span className="plan-price">₹3100/-</span>
              </li>
              <li>
                <span>12 Month</span>
                <span className="plan-price">₹5400/-</span>
              </li>
            </ul>
          </div>
          {/* 60 Mbps Plan */}
          <div className="plan-card">
            <h3 className="plan-title text-blue">60 Mbps</h3>
            <p className="plan-speed">Speed Up To</p>
            <ul className="plan-list">
              <li>
                <span>6 Month</span>
                <span className="plan-price">₹3300/-</span>
              </li>
              <li>
                <span>12 Month</span>
                <span className="plan-price">₹5700/-</span>
              </li>
            </ul>
          </div>
          {/* 80 Mbps Plan */}
          <div className="plan-card">
            <h3 className="plan-title text-yellow">80 Mbps</h3>
            <p className="plan-speed">Speed Up To</p>
            <ul className="plan-list">
              <li>
                <span>6 Month</span>
                <span className="plan-price">₹3500/-</span>
              </li>
              <li>
                <span>12 Month</span>
                <span className="plan-price">₹6000/-</span>
              </li>
            </ul>
          </div>
          {/* 100 Mbps Plan */}
          <div className="plan-card">
            <h3 className="plan-title text-green">100 Mbps</h3>
            <p className="plan-speed">Speed Up To</p>
            <ul className="plan-list">
              <li>
                <span>6 Month</span>
                <span className="plan-price">₹4000/-</span>
              </li>
              <li>
                <span>12 Month</span>
                <span className="plan-price">₹7000/-</span>
              </li>
            </ul>
          </div>
        </div>
        
      </section>
    </>
  );
};
