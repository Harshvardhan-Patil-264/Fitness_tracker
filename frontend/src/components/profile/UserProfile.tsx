import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="profile">
      <h2>User Profile</h2>
      <div>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserProfile;