// ===== PAGE PROFILE - W-AffBooster =====
// Page de profil utilisateur avec Bootstrap 5

import { getAdminLayout } from '../templates/layout.js';

export function getProfilePage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Profile</h1>
        <p class="text-muted mb-0">Manage your account information and settings</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshProfile()">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
        <button class="btn btn-primary" onclick="saveProfile()">
          <i class="bi bi-check-lg me-2"></i>Save Changes
        </button>
      </div>
    </div>

    <!-- Profile Tabs -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs" id="profileTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="personal-tab" data-bs-toggle="tab" data-bs-target="#personal" type="button" role="tab">
                  <i class="bi bi-person me-2"></i>Personal Info
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="security-tab" data-bs-toggle="tab" data-bs-target="#security" type="button" role="tab">
                  <i class="bi bi-shield-lock me-2"></i>Security
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="account-tab" data-bs-toggle="tab" data-bs-target="#account" type="button" role="tab">
                  <i class="bi bi-gear me-2"></i>Account Settings
                </button>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content" id="profileTabsContent">
              
              <!-- Personal Information Tab -->
              <div class="tab-pane fade show active" id="personal" role="tabpanel">
                <form id="personalForm">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0">
                            <i class="bi bi-person-badge me-2"></i>Basic Information
                          </h6>
                        </div>
                        <div class="card-body">
                          <div class="row g-3">
                            <div class="col-md-6">
                              <label for="firstName" class="form-label">First Name</label>
                              <input type="text" class="form-control" id="firstName" value="" required>
                            </div>
                            <div class="col-md-6">
                              <label for="lastName" class="form-label">Last Name</label>
                              <input type="text" class="form-control" id="lastName" value="" required>
                            </div>
                            <div class="col-12">
                              <label for="email" class="form-label">Email</label>
                              <input type="email" class="form-control" id="email" value="" required>
                            </div>
                            <div class="col-md-6">
                              <label for="phone" class="form-label">Phone</label>
                              <input type="tel" class="form-control" id="phone" value="">
                            </div>
                            <div class="col-md-6">
                              <label for="website" class="form-label">Website</label>
                              <input type="url" class="form-control" id="website" value="" placeholder="https://example.com">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0">
                            <i class="bi bi-geo-alt me-2"></i>Address Information
                          </h6>
                        </div>
                        <div class="card-body">
                          <div class="row g-3">
                            <div class="col-12">
                              <label for="address" class="form-label">Address</label>
                              <textarea class="form-control" id="address" rows="2"></textarea>
                            </div>
                            <div class="col-md-4">
                              <label for="postalCode" class="form-label">Postal Code</label>
                              <input type="text" class="form-control" id="postalCode" value="">
                            </div>
                            <div class="col-md-8">
                              <label for="city" class="form-label">City</label>
                              <input type="text" class="form-control" id="city" value="">
                            </div>
                            <div class="col-12">
                              <label for="country" class="form-label">Country</label>
                              <select class="form-select" id="country" required>
                                <option value="">Select Country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                                <option value="ES">Spain</option>
                                <option value="IT">Italy</option>
                                <option value="MA">Morocco</option>
                                <option value="DZ">Algeria</option>
                                <option value="TN">Tunisia</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <!-- Security Tab -->
              <div class="tab-pane fade" id="security" role="tabpanel">
                <form id="securityForm">
                  <div class="row g-4">
                    <div class="col-md-8">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0">
                            <i class="bi bi-key me-2"></i>Change Password
                          </h6>
                        </div>
                        <div class="card-body">
                          <div class="row g-3">
                            <div class="col-12">
                              <label for="currentPassword" class="form-label">Current Password</label>
                              <div class="input-group">
                                <input type="password" class="form-control" id="currentPassword" required>
                                <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('currentPassword')">
                                  <i class="bi bi-eye" id="currentPasswordIcon"></i>
                                </button>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <label for="newPassword" class="form-label">New Password</label>
                              <div class="input-group">
                                <input type="password" class="form-control" id="newPassword" required minlength="6">
                                <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('newPassword')">
                                  <i class="bi bi-eye" id="newPasswordIcon"></i>
                                </button>
                              </div>
                              <div class="form-text">Minimum 6 characters</div>
                            </div>
                            <div class="col-md-6">
                              <label for="confirmPassword" class="form-label">Confirm New Password</label>
                              <div class="input-group">
                                <input type="password" class="form-control" id="confirmPassword" required minlength="6">
                                <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('confirmPassword')">
                                  <i class="bi bi-eye" id="confirmPasswordIcon"></i>
                                </button>
                              </div>
                            </div>
                            <div class="col-12">
                              <div class="alert alert-info">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Password Requirements:</strong>
                                <ul class="mb-0 mt-2">
                                  <li>At least 6 characters long</li>
                                  <li>Use a combination of letters and numbers</li>
                                  <li>Avoid common passwords</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-4">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0">
                            <i class="bi bi-shield-check me-2"></i>Account Security
                          </h6>
                        </div>
                        <div class="card-body">
                          <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                              <i class="bi bi-person-check fs-4 text-success"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Account Status</div>
                              <div class="text-success">Active</div>
                            </div>
                          </div>
                          
                          <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                              <i class="bi bi-calendar fs-4 text-info"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Last Login</div>
                              <div class="text-muted">${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</div>
                            </div>
                          </div>
                          
                          <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                              <i class="bi bi-award fs-4 text-warning"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Role</div>
                              <div class="text-capitalize">${user.role}</div>
                            </div>
                          </div>
                          
                          <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                              <i class="bi bi-calendar-plus fs-4 text-primary"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Member Since</div>
                              <div class="text-muted">${new Date(user.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <!-- Account Settings Tab -->
              <div class="tab-pane fade" id="account" role="tabpanel">
                <form id="accountForm">
                  <div class="row g-4">
                    <div class="col-md-8">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0">
                            <i class="bi bi-gear me-2"></i>Account Preferences
                          </h6>
                        </div>
                        <div class="card-body">
                          <div class="row g-3">
                            <div class="col-md-6">
                              <label for="accountType" class="form-label">Account Type</label>
                              <select class="form-select" id="accountType" disabled>
                                <option value="individual" ${user.account_type === 'individual' ? 'selected' : ''}>Individual</option>
                                <option value="company" ${user.account_type === 'company' ? 'selected' : ''}>Company</option>
                              </select>
                              <div class="form-text">Account type cannot be changed</div>
                            </div>
                            <div class="col-md-6">
                              <label for="referralCode" class="form-label">Referral Code</label>
                              <input type="text" class="form-control" id="referralCode" value="${user.referral_code || ''}" readonly>
                              <div class="form-text">Your unique referral code</div>
                            </div>
                            <div class="col-12">
                              <label for="motivation" class="form-label">Motivation</label>
                              <textarea class="form-control" id="motivation" rows="3" placeholder="Tell us about your goals and motivation..."></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-4">
                      <div class="card">
                        <div class="card-header">
                          <h6 class="mb-0">
                            <i class="bi bi-info-circle me-2"></i>Account Information
                          </h6>
                        </div>
                        <div class="card-body">
                          
                          <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                              <i class="bi bi-envelope fs-4 text-info"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Email</div>
                              <div class="text-muted">${user.email}</div>
                            </div>
                          </div>
                          
                          <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                              <i class="bi bi-calendar fs-4 text-success"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Created</div>
                              <div class="text-muted">${new Date(user.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          
                          <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                              <i class="bi bi-pencil fs-4 text-warning"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                              <div class="fw-bold">Last Updated</div>
                              <div class="text-muted">${new Date(user.updated_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let isDirty = false;
    let currentUser = ${JSON.stringify(user)};
    
    // Initialize form validation and change tracking
    document.addEventListener('DOMContentLoaded', async function() {
      await loadUserProfile();
      initializeFormValidation();
      trackFormChanges();
    });
    
    async function loadUserProfile() {
      try {
        const response = await fetch('/api/user-profile');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            populateForm(data.user);
          } else {
            showToast('Failed to load profile data', 'error');
          }
        } else {
          showToast('Failed to load profile data', 'error');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        showToast('Error loading profile data', 'error');
      }
    }
    
    function populateForm(userData) {
      // Personal Information
      document.getElementById('firstName').value = userData.first_name || '';
      document.getElementById('lastName').value = userData.last_name || '';
      document.getElementById('email').value = userData.email || '';
      document.getElementById('phone').value = userData.phone || '';
      document.getElementById('website').value = userData.website || '';
      
      // Address Information
      document.getElementById('address').value = userData.address || '';
      document.getElementById('postalCode').value = userData.postal_code || '';
      document.getElementById('city').value = userData.city || '';
      document.getElementById('country').value = userData.country || '';
      
      // Account Settings
      document.getElementById('motivation').value = userData.motivation || '';
      
      // Update readonly fields
      document.getElementById('referralCode').value = userData.referral_code || '';
      
      // Update account type display
      const accountTypeSelect = document.getElementById('accountType');
      if (accountTypeSelect) {
        accountTypeSelect.value = userData.account_type || 'individual';
      }
      
      // Update security info
      updateSecurityInfo(userData);
    }
    
    function updateSecurityInfo(userData) {
      // Update last login display
      const lastLoginElements = document.querySelectorAll('.text-muted');
      lastLoginElements.forEach(element => {
        if (element.textContent.includes('Never') || element.textContent.includes('Last Login')) {
          element.textContent = userData.last_login ? new Date(userData.last_login).toLocaleDateString() : 'Never';
        }
      });
      
      // Update member since with created_at
      const memberSinceElements = document.querySelectorAll('.text-muted');
      memberSinceElements.forEach(element => {
        if (element.textContent.includes('Member Since')) {
          element.textContent = userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Unknown';
        }
      });
      
      // Update last updated display
      const lastUpdatedElements = document.querySelectorAll('.text-muted');
      lastUpdatedElements.forEach(element => {
        if (element.textContent.includes('Last Updated')) {
          element.textContent = userData.updated_at ? new Date(userData.updated_at).toLocaleDateString() : 'Unknown';
        }
      });
    }
    
    function initializeFormValidation() {
      // Personal form validation
      const personalForm = document.getElementById('personalForm');
      if (personalForm) {
        personalForm.addEventListener('submit', function(e) {
          e.preventDefault();
          savePersonalInfo();
        });
      }
      
      // Security form validation
      const securityForm = document.getElementById('securityForm');
      if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
          e.preventDefault();
          changePassword();
        });
      }
      
      // Account form validation
      const accountForm = document.getElementById('accountForm');
      if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
          e.preventDefault();
          saveAccountSettings();
        });
      }
    }
    
    function trackFormChanges() {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('input', function() {
          isDirty = true;
          updateSaveButton();
        });
      });
    }
    
    function updateSaveButton() {
      const saveBtn = document.querySelector('button[onclick="saveProfile()"]');
      if (saveBtn) {
        if (isDirty) {
          saveBtn.classList.remove('btn-primary');
          saveBtn.classList.add('btn-warning');
          saveBtn.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Save Changes';
        } else {
          saveBtn.classList.remove('btn-warning');
          saveBtn.classList.add('btn-primary');
          saveBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
        }
      }
    }
    
    async function saveProfile() {
      const activeTab = document.querySelector('#profileTabs .nav-link.active');
      if (!activeTab) return;
      
      const tabId = activeTab.getAttribute('data-bs-target').substring(1);
      
      switch (tabId) {
        case 'personal':
          await savePersonalInfo();
          break;
        case 'security':
          await changePassword();
          break;
        case 'account':
          await saveAccountSettings();
          break;
      }
    }
    
    async function savePersonalInfo() {
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        address: document.getElementById('address').value,
        postalCode: document.getElementById('postalCode').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
      };
      
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Personal information updated successfully!', 'success');
          isDirty = false;
          updateSaveButton();
        } else {
          showToast(data.error || 'Failed to update personal information', 'error');
        }
      } catch (error) {
        console.error('Error updating personal info:', error);
        showToast('Error updating personal information', 'error');
      }
    }
    
    async function changePassword() {
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }
      
      if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
      }
      
      try {
        const response = await fetch('/api/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Password changed successfully!', 'success');
          document.getElementById('securityForm').reset();
          isDirty = false;
          updateSaveButton();
        } else {
          showToast(data.error || 'Failed to change password', 'error');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        showToast('Error changing password', 'error');
      }
    }
    
    async function saveAccountSettings() {
      const formData = {
        motivation: document.getElementById('motivation').value
      };
      
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Account settings updated successfully!', 'success');
          isDirty = false;
          updateSaveButton();
        } else {
          showToast(data.error || 'Failed to update account settings', 'error');
        }
      } catch (error) {
        console.error('Error updating account settings:', error);
        showToast('Error updating account settings', 'error');
      }
    }
    
    function togglePassword(fieldId) {
      const field = document.getElementById(fieldId);
      const icon = document.getElementById(fieldId + 'Icon');
      
      if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      } else {
        field.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      }
    }
    
    function refreshProfile() {
      window.location.reload();
    }
    
    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = \`alert alert-\${type === 'error' ? 'danger' : type} position-fixed\`;
      toast.style.top = '20px';
      toast.style.right = '20px';
      toast.style.zIndex = '9999';
      toast.innerHTML = \`
        <div class="d-flex align-items-center">
          <i class="bi bi-\${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
          <span>\${message}</span>
        </div>
      \`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 5000);
    }
  `;

  return getAdminLayout('Profile', content, '/profile', user) + `<script>${scripts}</script>`;
}
