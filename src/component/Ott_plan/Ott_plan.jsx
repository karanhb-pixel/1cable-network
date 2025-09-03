import React from 'react'

export const Ott_plan = () => {
  return (
    <>
    {/* <!-- OTT Services Section --> */}
        <section id="ott-services" className="plans-section">
          <h2 className="plans-title">TV - 300 channels</h2>
          <p className="plans-subtitle">280 SD channel + 20 HD channel</p>
          <div className="plans-grid">
            {/* 3 Months Plan */}
            <div className="plan-card">
              <h3 className="plan-title text-blue">3 Months</h3>
              <ul className="plan-list">
                <li>
                  <span>Price</span>
                  <span className="plan-price">₹900/-</span>
                </li>
              </ul>
            </div>
            {/* 6 Months Plan */}
            <div className="plan-card">
              <h3 className="plan-title text-green">6 Months</h3>
              <ul className="plan-list">
                <li>
                  <span>Price</span>
                  <span className="plan-price">₹1800/-</span>
                </li>
              </ul>
            </div>
            {/* 12 Months Plan */}
            <div className="plan-card">
              <h3 className="plan-title text-yellow">12 Months</h3>
              <ul className="plan-list">
                <li>
                  <span>Price</span>
                  <span className="plan-price">₹3600/-</span>
                </li>
                <li>
                  <span className="plan-bonus text-red">
                    1 month extra free
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
    </>
  )
}



