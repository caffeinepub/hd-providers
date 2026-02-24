import { useNavigate } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-8">
        You don't have permission to access this page. This area is restricted to administrators only.
      </p>
      <button
        onClick={() => navigate({ to: '/' })}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
      >
        Go to Home
      </button>
    </div>
  );
}
