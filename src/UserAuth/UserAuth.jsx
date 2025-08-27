import React, { useState } from 'react';
import userData from '../user-data.json';

function UserAuth({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Find user in userData
    const foundUser = userData.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setError('');
      onAuthSuccess(foundUser);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <form className="user-auth-form" onSubmit={handleSubmit}>
      <h1>User Login</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

export default UserAuth;
