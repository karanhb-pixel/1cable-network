import "./App.css";

function Home() {
  return (
    <>
      <main>
        {/* <!-- Hero Section --> */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              FAST BROADBAND <br className="hidden-md" /> ANYWHERE YOU WANT IT
            </h1>
            <p className="hero-sub">Urban | Rural | Business</p>
            </div>
            {/* <!-- Placeholder for the person image --> */}
            <div className="hero-img-container">
              <img
                src="https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?_gl=1*1qyg67n*_ga*ODMxNDgzNTg4LjE3NTYwNDM4Nzc.*_ga_8JE65Q40S6*czE3NTYwNDM4NzYkbzEkZzEkdDE3NTYwNDM5NTgkajYwJGwwJGgw"
                alt="Customer using internet, smiling woman with laptop"
                className="hero-img"
                loading="lazy"
                decoding="async"
              />
          </div>
          {/* removed hero-img-desktop, image is above */}
        </div>

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
          <p className="plans-note">NO OTHER CHARGES</p>
          <p className="plans-note text-red text-3xl">Free Installations</p>
        </section>

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

        {/* <!-- Additional Services Section --> */}
        <section id="additional-services" className="plans-section">
          <h2 className="plans-title">ADDITIONAL SERVICES</h2>
          <div className="plans-grid">
            <div className="plan-card">
              <h3 className="plan-title text-yellow">Optical Fiber Base</h3>
              <p className="plan-speed">
                Get seamless internet with our high-speed optical fiber
                connection.
              </p>
              <ul className="plan-list">
                <li>
                  <span>Fiber Optic</span>
                </li>
                <li>
                  <span>High-Speed Internet</span>
                </li>
                <li>
                  <span>Unlimited Data</span>
                </li>
              </ul>
            </div>
            <div className="plan-card">
              <h3 className="plan-title text-green">Free Installation</h3>
              <p className="plan-speed">
                No extra charges for a hassle-free setup.
              </p>
              <ul className="plan-list">
                <li>
                  <span>No Hidden Fees</span>
                </li>
                <li>
                  <span>Professional Setup</span>
                </li>
                <li>
                  <span>Quick & Easy</span>
                </li>
              </ul>
            </div>
            <div className="plan-card">
              <h3 className="plan-title text-blue">Free Set-Top Box</h3>
              <p className="plan-speed">
                Every TV subscription comes with a complimentary set-top box.
              </p>
              <ul className="plan-list">
                <li>
                  <span>No Equipment Fee</span>
                </li>
                <li>
                  <span>Advanced Features</span>
                </li>
                <li>
                  <span>High-Definition</span>
                </li>
              </ul>
            </div>
            <div className="plan-card">
              <h3 className="plan-title text-red">24/7 Support</h3>
              <p className="plan-speed">
                Our dedicated support team is always here to help you.
              </p>
              <ul className="plan-list">
                <li>
                  <span>Dedicated Team</span>
                </li>
                <li>
                  <span>Fast Response</span>
                </li>
                <li>
                  <span>Online & Phone Support</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* <!-- Contact & Support Section --> */}
        <section id="contact" className="contact-section">
          <div className="contact-container">
            {/* Phone Numbers */}
            <div className="contact-info">
              <h3 className="contact-title">Reach Us</h3>
              <div className="contact-item">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  aria-hidden="true"
                  viewBox="0 0 640 640"
                >
                  <path
                    fill="currentColor"
                    d="M224.2 89c-7.9-18.9-28.5-28.9-48.1-23.6l-5.5 1.5C106 84.5 50.8 147.1 66.9 223.3 104 398.3 241.7 536 416.7 573.1 493 589.3 555.5 534 573.1 469.4l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2c-70.3-34.9-126.9-93.3-159.4-165l44.2-36c13.9-11.3 18.6-30.4 11.8-47L224.2 89z"
                  />
                </svg>
                <span className="contact-number">88663 64440</span>
              </div>
              <div className="contact-item">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  aria-hidden="true"
                  viewBox="0 0 640 640"
                >
                  <path
                    fill="currentColor"
                    d="M224.2 89c-7.9-18.9-28.5-28.9-48.1-23.6l-5.5 1.5C106 84.5 50.8 147.1 66.9 223.3 104 398.3 241.7 536 416.7 573.1 493 589.3 555.5 534 573.1 469.4l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2c-70.3-34.9-126.9-93.3-159.4-165l44.2-36c13.9-11.3 18.6-30.4 11.8-47L224.2 89z"
                  />
                </svg>
                <span className="contact-number">77779 96223</span>
              </div>
            </div>
            {/* 24/7 Customer Support */}
            <div className="support-info">
              <h3 className="support-title">24/7</h3>
              <p className="support-subtitle">CUSTOMER SUPPORT</p>
            </div>
          </div>
        </section>

        {/* <!-- Renewal & Address Section --> */}
        <section id="renewal" className="renewal-section">
          <div className="renewal-container">
            <div className="renewal-header">
              <h3 className="renewal-title">Online Renewal Options</h3>
              <div className="payment-icons">
                <div className="payment-icon">
                  <svg
                    width="32"
                    height="32"
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#e64a19"
                      d="M42.858 11.975c-4.546-2.624-10.359-1.065-12.985 3.481L23.25 26.927c-1.916 3.312.551 4.47 3.301 6.119l6.372 3.678a4.508 4.508 0 0 0 6.158-1.649l6.807-11.789a8.278 8.278 0 0 0-3.03-11.311z"
                    />
                    <path
                      fill="#fbc02d"
                      d="m35.365 16.723-6.372-3.678c-3.517-1.953-5.509-2.082-6.954.214l-9.398 16.275c-2.624 4.543-1.062 10.353 3.481 12.971a8.28 8.28 0 0 0 11.311-3.031l9.578-16.59a4.504 4.504 0 0 0-1.646-6.161z"
                    />
                    <path
                      fill="#43a047"
                      d="m36.591 8.356-4.476-2.585c-4.95-2.857-11.28-1.163-14.137 3.787L9.457 24.317a4.552 4.552 0 0 0 1.666 6.22l5.012 2.894a5.173 5.173 0 0 0 7.069-1.894l9.735-16.86a7.3 7.3 0 0 1 9.974-2.672l-6.322-3.649z"
                    />
                    <path
                      fill="#1e88e5"
                      d="m19.189 13.781-4.838-2.787a4.512 4.512 0 0 0-6.158 1.646L2.389 22.67c-2.857 4.936-1.163 11.252 3.787 14.101l3.683 2.121 4.467 2.573 1.939 1.115c-3.442-2.304-4.535-6.92-2.43-10.555l1.503-2.596 5.504-9.51a4.492 4.492 0 0 0-1.653-6.138z"
                    />
                  </svg>
                  <span className="payment-text">GPay</span>
                </div>
                <div className="payment-icon">
                  <svg
                    width="32"
                    height="32"
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#0d47a1"
                      d="M5.446 18.01H.548c-.277 0-.502.167-.503.502L0 30.519c-.001.3.196.45.465.45h2.07c.255 0 .465-.125.465-.375V27l2.126.009c1.399-.092 2.335-.742 2.725-2.052.117-.393.14-.733.14-1.137l.11-2.862c-.102-2.012-1.152-2.777-2.655-2.948zm-.451 5.455a.537.537 0 0 1-.534.535H3v-3h1.461c.293 0 .534.24.534.535v1.93zM13.938 18h-3.423c-.26 0-.483.08-.483.351v2.201c.028.294.231.448.52.448h2.855c.594 0 .532.972 0 1H11.84C10.101 22 9 23.562 9 25.137c0 .42.005 1.406 0 1.863-.008.651-.014 1.311.112 1.899.224 1.04 1.123 2.101 2.485 2.101h4.228c.541 0 1.173-.474 1.173-1.101v-8.274c.028-2.182-1.056-3.508-3.06-3.625zM14 27.55a.45.45 0 0 1-.448.45h-1.105a.45.45 0 0 1-.447-.45v-2.101a.45.45 0 0 1 .447-.449h1.105a.45.45 0 0 1 .448.449v2.101zm4-8.956v5.608c.124 1.6 1.608 2.798 3.171 2.798h1.414c.597 0 .561.969 0 .969H19.49c-.339 0-.462.177-.462.476v2.152c0 .226.183.396.422.396h2.959c2.416 0 3.592-1.159 3.591-3.757v-8.84c0-.276-.175-.383-.342-.383h-2.302c-.224 0-.355.243-.355.422v5.218c0 .199-.111.316-.29.316H21.41c-.264 0-.409-.143-.409-.396v-5.058C21 18.218 20.88 18 20.552 18h-2.22c-.265 0-.332.263-.332.594z"
                    />
                    <path
                      fill="#00adee"
                      d="M27.038 20.569v-2.138c0-.237.194-.431.43-.431H28c1.368-.285 1.851-.62 2.688-1.522.514-.557.966-.704 1.298-.113L32 18h1.569c.238 0 .431.194.431.431v2.138a.433.433 0 0 1-.431.431H32v9.569a.431.431 0 0 1-.43.431h-2.14a.43.43 0 0 1-.43-.431V21h-1.531a.434.434 0 0 1-.431-.431zm15.953 9.896a.54.54 0 0 1-.539.535h-1.91a.54.54 0 0 1-.54-.535v-8.494c0-1.284-2.002-1.284-2.002 0v8.494a.538.538 0 0 1-.539.535H35.54a.54.54 0 0 1-.54-.535V18.537a.54.54 0 0 1 .54-.537h1.976c.297 0 .539.241.539.537v.292c1.32-1.266 3.302-.973 4.416.228 2.097-2.405 5.69-.262 5.523 2.375 0 2.916-.026 6.093-.026 9.033a.54.54 0 0 1-.538.535h-1.891a.538.538 0 0 1-.539-.535v-8.44c0-1.307-2-1.37-2 0v8.44h-.009z"
                    />
                  </svg>
                  <span className="payment-text">Paytm</span>
                </div>
                <div className="payment-icon">
                  <svg
                    width="32"
                    height="32"
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#4527a0"
                      d="M42 37a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5v26z"
                    />
                    <path
                      fill="#fff"
                      d="M32.267 20.171c0-.681-.584-1.264-1.264-1.264h-2.334l-5.35-6.25c-.486-.584-1.264-.778-2.043-.584l-1.848.584c-.292.097-.389.486-.195.681l5.836 5.666h-8.851c-.292 0-.486.195-.486.486v.973c0 .681.584 1.506 1.264 1.506h1.972v4.305c0 3.502 1.611 5.544 4.723 5.544.973 0 1.378-.097 2.35-.486v3.112c0 .875.681 1.556 1.556 1.556h.786c.292 0 .584-.292.584-.584V21.969h2.812c.292 0 .486-.195.486-.486v-1.312zm-6.224 8.242c-.584.292-1.362.389-1.945.389-1.556 0-2.097-.778-2.097-2.529v-4.305h4.043v6.445z"
                    />
                  </svg>
                  <span className="payment-text">PhonePe</span>
                </div>
              </div>
            </div>
            <div className="renewal-address">
              <svg
                width="32"
                height="32"
                fill="none"
                aria-hidden="true"
                viewBox="0 0 640 640"
              >
                <path
                  fill="#ef4444"
                  d="M128 252.6C128 148.4 214 64 320 64s192 84.4 192 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM320 320c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z"
                />
              </svg>
              <p className="address-text">
                SHOP NO- 4, FIRST FLOOR, JALARAM SHOPING CENTER, CHIKHLI ABOVE
                SIYARAM BHAJIYA 396521
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
