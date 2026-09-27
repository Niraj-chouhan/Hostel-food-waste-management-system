import {useState } from "react";
import{Link, useNavigate} from "react-router-dom";
import{useAuth} from "../store/auth";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { getDashboardPath } from "../utils/roles";

export const Login =()=>{
  const [user, setUser] = useState({
       email:"",
       password:"",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const {storeTokenInLS} = useAuth();
  const handleInput = (e)=>{
      let name = e.target.name;
      let value = e.target.value;
  

  setUser({
     ...user,
     [name]:value,
  })
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    setIsSubmitting(true);
try {
    const response = await fetch(API_ENDPOINTS.login,{
        method:"POST",
        headers:{
        "Content-Type": "application/json",
        },
        body:JSON.stringify(user),
    });
    
   console.log("login form",response);
   
        const res_data = await response.json();

    if(response.ok){
        storeTokenInLS(res_data.token, res_data.user);
        setUser({email: "",  password: "" });
        toast.success(`Welcome back${res_data.user?.username ? `, ${res_data.user.username}` : ""}!`);
        navigate(getDashboardPath(res_data.user), { replace: true });

    }else{
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
    }
} catch (error) {
    console.log(error);
    toast.error("Unable to connect. Please try again.");
} finally {
    setIsSubmitting(false);
}
  }; 
  return (
    <main className="login-page">
      <div className="login-orb login-orb--one" />
      <div className="login-orb login-orb--two" />

      <section className="login-shell">
        <div className="login-showcase">
          <Link className="login-brand" to="/login" aria-label="Hostel Hub login">
            <span className="login-brand__mark">H</span>
            <span>Hostel Hub</span>
          </Link>

          <div className="login-showcase__content">
            <span className="login-eyebrow">Smart hostel experience</span>
            <h1>Good food.<br />Better living.</h1>
            <p>Daily menus, hostel services and updates, all together in one simple place.</p>

            <div className="login-features">
              <div><span>01</span><p>Live daily meal menu</p></div>
              <div><span>02</span><p>Fast hostel support</p></div>
              <div><span>03</span><p>Secure role-based access</p></div>
            </div>
          </div>

          <p className="login-showcase__footer">Fresh updates, every day.</p>
        </div>

        <div className="login-panel">
          <div className="login-form-wrap">
            <span className="login-mobile-brand">Hostel Hub</span>
            <div className="login-heading">
              <span>Welcome back</span>
              <h2>Sign in to your account</h2>
              <p>Enter your details to continue to your dashboard.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="email">Email address</label>
                <div className="login-input">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    id="email"
                    required
                    autoComplete="email"
                    value={user.email}
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="password">Password</label>
                  <span>Minimum 6 characters</span>
                </div>
                <div className="login-input">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    id="password"
                    required
                    minLength="6"
                    autoComplete="current-password"
                    value={user.password}
                    onChange={handleInput}
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="login-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <span className="button-spinner" /> : "Sign in"}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="login-register">New to Hostel Hub? <Link to="/register">Create an account</Link></p>
            <p className="login-security">Your account is protected with secure authentication.</p>
          </div>
        </div>
      </section>
    </main>
  );

};
