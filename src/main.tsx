import { createRoot } from 'react-dom/client'
import { SignupProvider } from './contexts/SignupContext';
import { AuthProvider } from './contexts/AuthContext'; // Import this
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SignupProvider>
      <App />
    </SignupProvider>
  </AuthProvider>
);