import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); 
  
  const { login, signup } = useAuth(); // Bypass removed
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSigningUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      setError(`Failed. (${err.code})`);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isSigningUp ? 'Sign Up' : 'Login'}</h2>
        
        {error && <p className="error">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        
        <button type="submit">{isSigningUp ? 'Sign Up' : 'Log In'}</button>
        
        <p className="toggle-auth" onClick={() => setIsSigningUp(!isSigningUp)}>
          {isSigningUp
            ? 'Already have an account? Log In'
            : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

export default Login;