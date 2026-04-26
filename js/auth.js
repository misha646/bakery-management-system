// js/auth.js - Integrated Security Layer (Activation & Passkey)
import { state, saveState } from "./state.js";
import { mountApp } from "./app.js"; 
import { fetchData } from "./api.js"; 

/* =====================================================
    1. LOGIN PAGE
   ===================================================== */
export function renderLogin() {
  document.body.className = "auth-bg";
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <h1 class="brand"><img src="./assets/icons/cake.png" class="brand-icon"/></h1>
        <p class="tagline">Every flavour has a story!</p>
        <h2 class="welcome">Welcome Back</h2>
        
        <form id="loginForm">
          <label>Username</label>
          <input type="text" id="username" autocomplete="username" required placeholder="Enter username" />
          
          <label>Password</label>
          <div class="password-wrapper">
            <input type="password" id="password" autocomplete="current-password" required placeholder="Enter password" />
            <span id="togglePass" class="eye-icon"></span>
          </div>
          
          <label>Role</label>
          <select id="role" required>
            <option value="">-- Choose Role --</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="baker">Baker</option>
            <option value="staff">Staff</option>
          </select>
          
          <button type="submit" class="login-btn" id="loginBtn">Login</button>
        </form>
        <p class="signup" style="margin-top:15px; text-align:center;">
            <a href="#" id="forgotBtn">Forgot Password?</a>
        </p>
      </div>
    </div>
  `;

  const passwordInput = document.getElementById("password");
  const toggle = document.getElementById("togglePass");
  toggle.onclick = () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  };

  document.getElementById("forgotBtn").onclick = (e) => {
      e.preventDefault();
      renderForgot();
  };

  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("loginBtn");
    const usernameVal = document.getElementById("username").value.trim();
    const passwordVal = passwordInput.value.trim();
    const roleVal = document.getElementById("role").value.toLowerCase();

    btn.disabled = true;
    btn.textContent = "Authenticating...";

    try {
      const result = await fetchData('login/', 'POST', {
        username: usernameVal,
        password: passwordVal
      });

      // FIXED: user_name is the source of truth from UserMst
      if (result && result.user_name) {
        
        // --- FIXED ROLE VERIFICATION ---
        const serverRole = (result.role || result.designation || "").toLowerCase();
        
        if (serverRole !== roleVal && !serverRole.includes(roleVal)) {
            alert(`Access Denied: You are registered as ${serverRole.toUpperCase()}.`);
            btn.disabled = false;
            btn.textContent = "Login";
            return;
        }

        // --- FIRST-LOGIN DETECTION ---
        if (result.is_first_login === 1 || result.is_first_login === true) {
          localStorage.setItem("bmsToken", "activation_pending");
          renderActivation(result.user_name);
          return;
        }

        // --- TOKEN CAPTURE ---
        const authToken = result.token; 
        if (!authToken) {
            throw new Error("No authentication token received from server.");
        }

        // --- FIXED MAPPING: Standardizing user_id as 'id' ---
        // result.id is mapped from user_id in the UserSerializer
        const userObj = {
          id: result.id, 
          user_name: result.user_name,
          username: result.user_name,
          role: serverRole,
          designation: result.designation,
          fullName: result.fullName || result.user_name,
          branch_name: result.branch_name || "Branch Office",
          fk_branch_id: result.fk_branch || result.fk_branch_id,
          securityKey: result.security_key
        };

        // Standardized state save
        saveState(userObj, authToken);
        
        document.body.className = ""; 
        mountApp(); 
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      alert("Login Failed: " + err.message);
      btn.disabled = false;
      btn.textContent = "Login";
    }
  };
}

/* =====================================================
    2. FORGOT PASSWORD
   ===================================================== */
export function renderForgot() {
    document.body.className = "auth-bg";
    const app = document.getElementById("app");
  
    app.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <h1 class="brand"><img src="./assets/icons/cake.png" class="brand-icon"/></h1>
          <h2 class="welcome">Reset Password</h2>
          <p class="tagline" style="text-align:center">Enter your Security Key to recover access</p>
  
          <form id="forgotForm">
            <label>Username</label>
            <input type="text" id="fpUsername" autocomplete="username" required />
            
            <label>6-Digit Security Key</label>
            <input type="password" id="fpSecurityKey" maxlength="6" minlength="6" inputmode="numeric" pattern="[0-9]*" required placeholder="Enter your passkey" />
  
            <label>New Password</label>
            <input type="password" id="newPassword" autocomplete="new-password" placeholder="Min 8 chars" required />
            
            <label>Confirm Password</label>
            <input type="password" id="confirmPassword" autocomplete="new-password" required />
            
            <button class="login-btn" id="fpBtn">Update Password</button>
          </form>
          <p class="signup" style="margin-top:15px; text-align:center;"><a href="#" id="backLogin">Back to Login</a></p>
        </div>
      </div>
    `;
  
    document.getElementById("forgotForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("fpBtn");
      const username = document.getElementById("fpUsername").value.trim();
      const inputKey = document.getElementById("fpSecurityKey").value.trim();
      const newPass = document.getElementById("newPassword").value.trim();
      const confirm = document.getElementById("confirmPassword").value.trim();
  
      if (newPass !== confirm) return alert("Passwords do not match.");
  
      btn.disabled = true;
      btn.textContent = "Updating...";

      try {
          await fetchData('reset-password/', 'POST', {
              username: username,
              security_key: inputKey,
              new_password: newPass
          });

          alert("Password updated! Please login.");
          renderLogin();
      } catch (err) {
          alert("Reset failed: " + err.message);
          btn.disabled = false;
          btn.textContent = "Update Password";
      }
    };
  
    document.getElementById("backLogin").onclick = e => {
      e.preventDefault();
      renderLogin();
    };
}

/* =====================================================
    3. ACCOUNT ACTIVATION
   ===================================================== */
export function renderActivation(username) {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <h1 class="brand"><img src="./assets/icons/cake.png" class="brand-icon"/></h1>
          <h2 class="welcome">Activate Account</h2>
          <p class="tagline">Set your credentials for the first time</p>
          
          <form id="activationForm">
            <label>Set New Password</label>
            <input type="password" id="actPass" required minlength="8" placeholder="Min 8 characters" />
            
            <label>Set 6-Digit Security Key</label>
            <input type="password" id="actKey" maxlength="6" minlength="6" inputmode="numeric" pattern="[0-9]*" required placeholder="Example: 123456" />
            
            <button class="login-btn" id="actBtn">Activate & Login</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("activationForm").onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById("actBtn");
        btn.disabled = true;
        btn.textContent = "Processing...";

        try {
            await fetchData('activate/', 'POST', {
                username: username,
                password: document.getElementById("actPass").value,
                security_key: document.getElementById("actKey").value
            });
            alert("Account Activated! Please log in.");
            renderLogin(); 
        } catch (err) {
            alert("Activation failed: " + err.message);
            btn.disabled = false;
            btn.textContent = "Activate & Login";
        }
    };
}