import React from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordUpdateForm from '../components/PasswordUpdateForm';

export default function ChangePassword() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 pt-20">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Profile
          </button>
        </div>
        
        <PasswordUpdateForm />
      </div>
    </div>
  );
}
