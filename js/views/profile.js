// js/views/profile.js
import { state, refreshGlobalState } from "../state.js";
import { navigate } from "../router.js";
import { fetchData } from "../api.js";

let viewMode = 'view'; 

/* =====================================================
    1. MAIN RENDERER
   ===================================================== */
export function renderProfile() {
    const u = state.user; 
    if (!u) return `<div class="main-content" style="padding:50px; text-align:center;"><h2>Access Denied. Please login.</h2></div>`;

    let activeContent = '';
    if (viewMode === 'view') activeContent = renderReadView(u);
    else if (viewMode === 'edit_profile') activeContent = renderEditProfileForm(u);
    else if (viewMode === 'update_password') activeContent = renderUpdatePasswordForm(u);

    return `
        <div class="main-content bakery-theme" id="profile-module-root" style="padding:30px; background:#fdfaf9; min-height:100vh; animation: fadeIn 0.3s ease;">
            <div style="max-width: 900px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #efebe9; padding-bottom: 20px;">
                    <div>
                        <h2 style="color: #3e2723; margin:0; font-weight:800; font-size:1.8rem;">
                            ${viewMode === 'view' ? 'MY ACCOUNT' : (viewMode === 'edit_profile' ? 'UPDATE PROFILE' : 'CHANGE PASSWORD')}
                        </h2>
                        <p style="margin:5px 0 0 0; color:#8d6e63; font-weight:600;">
                            Account ID: <span style="font-family:monospace;">#${u.id}</span> | 
                            Role: <span style="text-transform: uppercase; color:#3e2723; font-weight:800;">${u.role || 'Staff'}</span>
                        </p>
                    </div>
                    ${viewMode !== 'view' ? `
                        <button id="profileBackBtn" style="padding:8px 20px; background:#fff; color:#5d4037; border:1px solid #ddd; border-radius:8px; cursor:pointer; font-weight:700; text-transform:uppercase; font-size:0.7rem;">
                            CANCEL
                        </button>` : ''}
                </div>

                <div class="animate-fade-in">
                    ${activeContent}
                </div>
            </div>
        </div>
    `;
}

function renderReadView(user) {
    return `
        <div style="background:white; padding: 40px; border-radius:16px; border:1px solid #e0d7d5; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
                <div class="info-group">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Full Name</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#3e2723; margin:0;">${user.fullName || user.username || '---'}</p>
                </div>
                <div class="info-group">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Email Address</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#3e2723; margin:0;">${user.email || '---'}</p>
                </div>
                <div class="info-group">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Mobile Number</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#3e2723; margin:0;">${user.phone || '---'}</p>
                </div>
                <div class="info-group">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Date of Birth</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#3e2723; margin:0;">${user.date_of_birth || '---'}</p>
                </div>
                <div class="info-group">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Branch</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#d2691e; margin:0;">${user.branch_name || '---'}</p>
                </div>
                <div class="info-group">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Joining Date</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#3e2723; margin:0;">${user.date_of_joining || '---'}</p>
                </div>
                <div class="info-group" style="grid-column: 1 / -1;">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#a1887f; text-transform:uppercase; margin-bottom:8px;">Residential Address</label>
                    <p style="font-size:1.1rem; font-weight:600; color:#3e2723; margin:0;">${user.residential_address || '---'}</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 20px; border-top: 1px solid #f8f5f2; padding-top: 30px;">
                <button id="gotoEditProfile" style="padding:15px 25px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800; flex:1; text-transform:uppercase;">Edit Profile</button>
                <button id="gotoUpdatePass" style="padding:15px 25px; background:#8d6e63; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800; flex:1; text-transform:uppercase;">Change Password</button>
            </div>
        </div>
    `;
}

function renderEditProfileForm(user) {
    return `
        <form id="editProfileForm" style="background:white; padding: 40px; border-radius:16px; border:1px solid #e0d7d5; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div>
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:8px;">Full Name</label>
                    <input type="text" name="user_name" value="${user.username || ''}" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none; font-weight:600;">
                </div>
                <div>
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:8px;">Email Address</label>
                    <input type="email" name="email" value="${user.email || ''}" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none; font-weight:600;">
                </div>
                <div>
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:8px;">Phone Number</label>
                    <input type="tel" name="phone" value="${user.phone || ''}" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none; font-weight:600;">
                </div>
                <div>
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:8px;">Date of Birth</label>
                    <input type="date" name="date_of_birth" value="${user.date_of_birth || ''}" style="width:100%; padding:10px; border:2px solid #ddd; border-radius:8px; outline:none; font-weight:600;">
                </div>
                <div style="grid-column: 1 / -1;">
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:8px;">Residential Address</label>
                    <input type="text" name="residential_address" value="${user.residential_address || ''}" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none; font-weight:600;">
                </div>
            </div>

            <div style="background: #fff8f8; padding: 25px; border-radius: 12px; border: 1px solid #ffcdd2;">
                <h5 style="color:#d32f2f; margin:0 0 10px 0; font-weight:800; text-transform:uppercase; font-size:0.75rem;">Identity Verification Required</h5>
                <p style="font-size:0.7rem; color:#666; margin-bottom:15px;">To save profile changes, please enter your current password and security passkey.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <input type="password" name="old_password" placeholder="Current Password" required style="padding:12px; border:2px solid #ddd; border-radius:8px; outline:none;">
                    <input type="text" name="security_key_verify" placeholder="Security Passkey (6 digits)" required style="padding:12px; border:2px solid #ddd; border-radius:8px; outline:none;">
                </div>
            </div>

            <button type="submit" style="margin-top: 30px; width: 100%; padding:18px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Update Profile</button>
        </form>
    `;
}

function renderUpdatePasswordForm(user) {
    return `
        <div style="display:flex; justify-content:center;">
            <form id="updatePasswordForm" style="background:white; padding: 40px; border-radius:16px; border:1px solid #e0d7d5; box-shadow: 0 4px 15px rgba(0,0,0,0.05); width: 100%; max-width: 500px;">
                <h4 style="margin:0 0 25px 0; color:#3e2723; font-weight:800; font-size:1.2rem; text-align:center;">Change Password</h4>
                
                <div style="margin-bottom: 25px;">
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:5px;">Current Password</label>
                    <input type="password" name="old_password" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none;">
                </div>

                <div style="margin-bottom: 25px; border-top:1px solid #eee; padding-top:20px;">
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:5px;">New Password</label>
                    <input type="password" name="new_password" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none;">
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display:block; font-size:0.7rem; font-weight:800; color:#5d4037; margin-bottom:5px;">Confirm New Password</label>
                    <input type="password" name="confirm_new_password" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none;">
                </div>

                <div style="margin-bottom: 30px; background: #fff8f8; padding: 20px; border-radius: 10px; border: 1px dashed #d32f2f;">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#d32f2f; margin-bottom:8px;">Security Passkey Verification</label>
                    <input type="text" name="security_key_verify" placeholder="Enter your 6-digit Security Passkey" required style="width:100%; padding:12px; border:2px solid #ddd; border-radius:8px; outline:none;">
                </div>

                <button type="submit" style="width: 100%; padding:18px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800; text-transform:uppercase; letter-spacing:1px;">Update Password</button>
            </form>
        </div>
    `;
}

export function bindProfileActions() {
    const root = document.getElementById("profile-module-root");
    if (!root) return;

    root.onclick = (e) => {
        if (e.target.id === "gotoEditProfile") { viewMode = 'edit_profile'; refreshView(); }
        if (e.target.id === "gotoUpdatePass") { viewMode = 'update_password'; refreshView(); }
        if (e.target.id === "profileBackBtn") { viewMode = 'view'; refreshView(); }
    };

    const profileForm = document.getElementById("editProfileForm");
    if (profileForm) {
        profileForm.onsubmit = async (e) => {
            e.preventDefault();

            if (!confirm("Are you sure you want to update your profile? Identity verification will be performed.")) {
                return;
            }

            const formData = new FormData(profileForm);
            const payload = {};
            for (let [key, value] of formData.entries()) {
                payload[key] = value;
            }

            try {
                const response = await fetchData(`users/${state.user.id}/`, "PATCH", payload);
                
                await refreshGlobalState(); 
                
                alert("Profile updated successfully!");
                viewMode = 'view';
                refreshView();
            } catch (err) {
                alert("Verification Failed: " + err.message);
            }
        };
    }

    const passForm = document.getElementById("updatePasswordForm");
    if (passForm) {
        passForm.onsubmit = async (e) => {
            e.preventDefault();

            if (!confirm("Update account password? Identity verification is required.")) {
                return;
            }

            const formData = new FormData(passForm);
            const newPassword = formData.get('new_password');
            const confirmPassword = formData.get('confirm_new_password');

            if (newPassword !== confirmPassword) {
                return alert("New passwords do not match!");
            }

            const payload = {
                old_password: formData.get('old_password'),
                new_password: newPassword,
                security_key_verify: formData.get('security_key_verify')
            };

            try {
                await fetchData(`users/${state.user.id}/`, "PATCH", payload);
                alert("Password changed successfully! Please login again.");
                viewMode = 'view';
                refreshView();
            } catch (err) {
                alert("Password Update Failed: " + err.message);
            }
        };
    }
}

function refreshView() {
    const root = document.getElementById("view-root");
    if (root) {
        root.innerHTML = renderProfile();
        bindProfileActions();
    }
}