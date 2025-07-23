// Admin.js for port 3002 - Clean version without alerts
// Admin.js for port 3002 - Clean version without alerts
console.log('Admin.js loaded for port 3002');

// Global function to handle edit image upload
window.handleEditImageUpload = function(input) {
  console.log('handleEditImageUpload called');
  const file = input.files[0];
  if (!file) {
    console.log('No file selected');
    return;
  }
  
  console.log('File selected:', file.name);
  const reader = new FileReader();
  
  reader.onload = function(e) {
    console.log('File loaded, showing crop modal');
    
    // Get the edit modal container
    const editPersonModal = document.getElementById('editPersonModal');
    if (!editPersonModal) {
      console.error('Edit person modal not found');
      return;
    }
    
    // Create crop card in the right section
    const cropCardHTML = `
      <div id="editCropCard" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15); padding: 1.5em; width: 400px; z-index: 2000;">
        <div style="position: relative;">
          <!-- Close button in top right corner -->
          <button id="editCloseCropBtn" style="position: absolute; top: -10px; right: -10px; background: #dc3545; color: #fff; border: none; border-radius: 50%; width: 30px; height: 30px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2001;">×</button>
          
          <!-- Crop image container -->
          <div style="margin-bottom: 1em;">
            <img id="editCropImagePreview" src="${e.target.result}" style="width: 100%; height: 300px; object-fit: contain; border-radius: 8px; background: #f0f0f0;" />
          </div>
          
          <!-- Save button in bottom right corner -->
          <div style="display: flex; justify-content: flex-end;">
            <button id="editSaveCropBtn" style="background: #007bff; color: #fff; border: none; border-radius: 7px; padding: 0.7em 1.5em; font-size: 1rem; font-weight: 600; cursor: pointer;">Save Image</button>
          </div>
        </div>
      </div>
    `;
    
    // Add crop card to the edit modal
    editPersonModal.insertAdjacentHTML('beforeend', cropCardHTML);
    
    // Initialize cropper
    const editCropImg = document.getElementById('editCropImagePreview');
    let editCropper = null;
    
    if (editCropImg) {
      editCropImg.onload = function() {
        console.log('Crop image loaded, initializing cropper');
        if (editCropper) { 
          editCropper.destroy(); 
          editCropper = null; 
        }
        
        editCropper = new Cropper(editCropImg, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          background: false,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          responsive: true,
          dragMode: 'move',
          guides: true,
          highlight: true,
          cropBoxResizable: true,
          cropBoxMovable: true,
          minCropBoxWidth: 100,
          minCropBoxHeight: 100,
          ready: function() {
            console.log('Cropper ready');
            const cropBoxData = editCropper.getCropBoxData();
            if (cropBoxData.width < 100 || cropBoxData.height < 100) {
              editCropper.setCropBoxData({
                width: Math.min(100, cropBoxData.width),
                height: Math.min(100, cropBoxData.height)
              });
            }
          }
        });
      };
    }
    
    // Close crop card functionality
    const closeCropBtn = document.getElementById('editCloseCropBtn');
    if (closeCropBtn) {
      closeCropBtn.onclick = function() {
        console.log('Closing crop card');
        const cropCard = document.getElementById('editCropCard');
        if (cropCard) {
          cropCard.remove();
        }
        if (editCropper) { 
          editCropper.destroy(); 
          editCropper = null; 
        }
      };
    }
    
    // Save cropped image functionality
    const saveCropBtn = document.getElementById('editSaveCropBtn');
    if (saveCropBtn) {
      saveCropBtn.onclick = function() {
        console.log('Saving cropped image');
        if (editCropper) {
          const cropData = editCropper.getData(true);
          const cropW = Math.round(cropData.width);
          const cropH = Math.round(cropData.height);
          
          const canvas = editCropper.getCroppedCanvas({ 
            width: 220, 
            height: 220, 
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
            fillColor: '#ffffff'
          });
          
          const croppedImageData = canvas.toDataURL('image/png', 1.0);
          
          // Update the avatar
          const editAvatarIcon = document.getElementById('editPersonAvatarIcon');
          if (editAvatarIcon) {
            editAvatarIcon.src = croppedImageData;
            editAvatarIcon.style.filter = 'none';
            editAvatarIcon.style.width = '100%';
            editAvatarIcon.style.height = '100%';
            editAvatarIcon.style.objectFit = 'cover';
            editAvatarIcon.style.borderRadius = '50%';
            console.log('Avatar updated with cropped image');
          }
          
          // Remove crop card
          const cropCard = document.getElementById('editCropCard');
          if (cropCard) {
            cropCard.remove();
          }
          
          editCropper.destroy();
          editCropper = null;
          console.log('Image saved successfully');
        }
      };
    }
  };
  
  reader.readAsDataURL(file);
};

// Global function to handle adding social links in edit modal
window.addEditSocialLink = function() {
  console.log('=== addEditSocialLink called ===');
  
  // Get the edit social links container and button
  const editSocialLinksContainer = document.getElementById('editSocialLinksContainer');
  const editAddSocialLinkBtn = document.getElementById('editAddSocialLinkBtn');
  
  console.log('Elements found:', {
    editSocialLinksContainer: !!editSocialLinksContainer,
    editAddSocialLinkBtn: !!editAddSocialLinkBtn
  });
  
  if (!editSocialLinksContainer) {
    console.error('Edit social links container not found');
    return;
  }
  
  // Initialize editSocialLinks array if it doesn't exist
  if (typeof window.editSocialLinks === 'undefined') {
    window.editSocialLinks = [];
  }
  
  console.log('Current social links:', window.editSocialLinks);
  
  // Add new social link
  window.editSocialLinks.push({ type: '', url: '' });
  
  console.log('After adding new link:', window.editSocialLinks);
  
  // Render the social links
  window.renderEditSocialLinks();
  
  // Update the main card count
  window.updateMainCardSocialLinksCount();
  
  console.log('Social link added successfully');
};

// Global function to render edit social links
window.renderEditSocialLinks = function() {
  const editSocialLinksContainer = document.getElementById('editSocialLinksContainer');
  
  // If there are no social links, do not show any input boxes
  if (!window.editSocialLinks || !Array.isArray(window.editSocialLinks) || window.editSocialLinks.length === 0) {
    editSocialLinksContainer.innerHTML = '';
    return;
  }
  
  editSocialLinksContainer.innerHTML = window.editSocialLinks.map((link, idx) => `
    <div style="display: flex; flex-direction: row; align-items: center; gap: 2em; margin-bottom: 0.7em; width: 100%;">
      <div style="flex: 1.2; position: relative;">
        <div class="edit-social-type-input" tabindex="0" data-idx="${idx}" style="width: 100%; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.7em 1em; display: flex; align-items: center; cursor: pointer;">
          <span class="edit-social-type-selected" style="color: ${link.type ? '#222' : '#888'};">${link.type || 'Select...'}</span>
          <span style="margin-left: auto; color: #888;"><svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#888" stroke-width="2" fill="none"/></svg></span>
        </div>
        <div class="edit-social-type-dropdown" style="display: none; position: absolute; left: 0; top: 100%; z-index: 10; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.13); min-width: 100%;">
          ${["Google Scholar","ORCID","LinkedIn","Twitter","Github","Other"].map(type => `
            <div class="edit-social-type-option" data-type="${type}" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer;">${type}</div>
          `).join('')}
        </div>
      </div>
      <div style="flex: 3.5;">
        <input class="edit-social-url-input" type="text" placeholder="URL" value="${link.url || ''}" style="width: 100%; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.7em 1em;" />
      </div>
      <button class="edit-delete-social-link-btn" data-idx="${idx}" type="button" style="background: #e74c3c; color: #fff; border: none; border-radius: 7px; padding: 0.6em 0.9em; font-size: 1.1em; cursor: pointer;">
        <svg width="16" height="16" fill="#fff" viewBox="0 0 20 20"><path d="M6 6l8 8M6 14L14 6" stroke="#fff" stroke-width="2.2"/></svg>
      </button>
    </div>
  `).join('');

  // Dropdown logic for each social link
  Array.from(editSocialLinksContainer.getElementsByClassName('edit-social-type-input')).forEach((el, idx) => {
    const dropdown = el.nextElementSibling;
    let open = false;

    // Remove any previous document click listeners to avoid stacking
    if (el._docClickHandler) {
      document.removeEventListener('click', el._docClickHandler);
    }

    el.onclick = function(e){
      e.stopPropagation();
      // Close all other dropdowns
      Array.from(editSocialLinksContainer.getElementsByClassName('edit-social-type-dropdown')).forEach(d => d.style.display = 'none');
      Array.from(editSocialLinksContainer.getElementsByClassName('edit-social-type-input')).forEach(input => input.style.borderColor = '#e9ecef');
      dropdown.style.display = open ? 'none' : 'block';
      el.style.borderColor = open ? '#e9ecef' : '#007bff';
      open = !open;

      // Attach a one-time document click handler to close the dropdown
      el._docClickHandler = function(ev) {
        if (!el.contains(ev.target) && !dropdown.contains(ev.target)) {
          dropdown.style.display = 'none';
          el.style.borderColor = '#e9ecef';
          open = false;
          document.removeEventListener('click', el._docClickHandler);
        }
      };
      setTimeout(() => {
        document.addEventListener('click', el._docClickHandler);
      }, 0);
    };

    Array.from(dropdown.getElementsByClassName('edit-social-type-option')).forEach(opt => {
      opt.onmouseenter = function(){ this.style.background = '#e6f0ff'; };
      opt.onmouseleave = function(){ this.style.background = '#fff'; };
      opt.onclick = function(e){
        e.stopPropagation();
        window.editSocialLinks[idx].type = this.getAttribute('data-type');
        window.renderEditSocialLinks();
      };
    });
  });

  // URL input logic
  Array.from(editSocialLinksContainer.getElementsByClassName('edit-social-url-input')).forEach((input, idx) => {
    input.onfocus = function(){ this.style.borderColor = '#007bff'; };
    input.onblur = function(){ this.style.borderColor = '#e9ecef'; };
    input.oninput = function(){ window.editSocialLinks[idx].url = this.value; };
  });

  // Delete button logic (allow deleting all social links)
  Array.from(editSocialLinksContainer.getElementsByClassName('edit-delete-social-link-btn')).forEach(btn => {
    btn.onclick = function(){
      const idx = parseInt(this.getAttribute('data-idx'));
        window.editSocialLinks.splice(idx, 1);
        window.renderEditSocialLinks();
    };
  });
  attachEditModalListeners(); // <-- add this at the end
};

// Global function to cancel edit and reset to original values
window.cancelEditPerson = function() {
  console.log('=== CANCEL EDIT PERSON FUNCTION CALLED ===');
  // Re-initialize edit modal fields from storage
  window.initializeEditModal();
  // Close the modal
  const editPersonModal = document.getElementById('editPersonModal');
  if (editPersonModal) editPersonModal.style.display = 'none';
};

// Global function to update person
window.updatePerson = function() {
  // Always get the index
  const idx = window.currentEditPersonIdx;
  let people = loadPeopleData();
  if (typeof idx === 'number' && people[idx]) {
    // Update existing
    people[idx] = {
      name: document.getElementById('editPersonNameInput').value,
      role: document.getElementById('editPersonRoleSelected').textContent,
      info: document.getElementById('editPersonInfoInput').value,
      imageSrc: document.getElementById('editPersonAvatarIcon').src,
      rollNumber: document.getElementById('editRollNumberInput')?.value || '',
      socialLinks: Array.isArray(window.editSocialLinks) ? JSON.parse(JSON.stringify(window.editSocialLinks)) : [],
      showInPeople: document.getElementById('editShowInPeopleCheckbox')?.checked || false
    };
    savePeopleData(people);
    renderAllPeopleCards();

    // Update main card if the name matches
    const mainCard = document.getElementById('saurabhKumarCard');
    if (mainCard) {
      const mainName = mainCard.querySelector('.person-name')?.textContent?.trim();
      if (mainName === people[idx].name) {
        // Update all main card fields
        const img = mainCard.querySelector('.person-avatar');
        if (img) img.src = people[idx].imageSrc;
        const nameEl = mainCard.querySelector('.person-name');
        if (nameEl) nameEl.textContent = people[idx].name;
        const infoEl = mainCard.querySelector('.person-info');
        if (infoEl) infoEl.textContent = people[idx].info;
        const roleEl = mainCard.querySelector('.person-role-badge');
        if (roleEl) roleEl.textContent = people[idx].role;
        // Social links
        const socialLinksEl = mainCard.querySelector('.person-social-links');
        if (socialLinksEl) {
          socialLinksEl.innerHTML = '';
          (people[idx].socialLinks || []).forEach(link => {
            if (link.type && link.url) {
              const a = document.createElement('a');
              a.href = link.url;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.className = 'person-social-link';
              a.textContent = link.type;
              socialLinksEl.appendChild(a);
            }
          });
        }
      }
    }
  }
  // Close modal if needed
  const modal = document.getElementById('editPersonModal');
  if (modal) modal.style.display = 'none';
};

// Global function to update main card social links count
window.updateMainCardSocialLinksCount = function() {
  const mainCard = document.getElementById('saurabhKumarCard');
  if (!mainCard) {
    console.error('Main card not found');
    return;
  }
  
  // Find the social links count span in the main card
  const socialLinksSpan = mainCard.querySelector('span[style*="color: #888; font-size: 0.97rem;"]');
  if (!socialLinksSpan) {
    console.error('Social links count span not found');
    return;
  }
  
  // Get the count from editSocialLinks array
  const count = window.editSocialLinks ? window.editSocialLinks.length : 0;
  
  // Update the text
  socialLinksSpan.textContent = `${count} Social Link${count !== 1 ? 's' : ''}`;
  
  console.log(`Updated main card social links count to: ${count}`);
};

// Global selectRole function for editable card
window.selectRole = function(role) {
  console.log('selectRole called with:', role);
  
  const editPersonRoleSelected = document.getElementById('editPersonRoleSelected');
  const editPersonRoleDropdown = document.getElementById('editPersonRoleDropdown');
  const editPersonRoleInput = document.getElementById('editPersonRoleInput');
  const editRollField = document.getElementById('editRollNumberField');
  
  console.log('Elements found:', {
    editPersonRoleSelected: !!editPersonRoleSelected,
    editPersonRoleDropdown: !!editPersonRoleDropdown,
    editPersonRoleInput: !!editPersonRoleInput,
    editRollField: !!editRollField
  });
  
  if (editPersonRoleSelected) {
    editPersonRoleSelected.textContent = role;
    console.log('Updated role text to:', role);
    console.log('Element text content after update:', editPersonRoleSelected.textContent);
  } else {
    console.error('editPersonRoleSelected element not found');
  }
  
  if (editPersonRoleDropdown) {
    editPersonRoleDropdown.style.display = 'none';
    console.log('Dropdown hidden');
  }
  
  if (editPersonRoleInput) {
    editPersonRoleInput.style.borderColor = '#e9ecef';
    console.log('Border color reset');
  }
  
  // Show/hide roll number field based on role
  const roleLower = role.toLowerCase();
  const rolesWithRollNumber = ['phd researcher', 'm.tech. researcher', 'student'];
  
  if (editRollField) {
    if (rolesWithRollNumber.includes(roleLower)) {
      editRollField.style.display = 'flex';
      console.log('Roll number field shown for role:', role);
    } else {
      editRollField.style.display = 'none';
      console.log('Roll number field hidden for role:', role);
    }
  }
  
  // Update the editRoleOpen variable to keep track of dropdown state
  if (typeof editRoleOpen !== 'undefined') {
    editRoleOpen = false;
  }
  
  console.log('selectRole function completed');
};

// Password validation function
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
}

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least 1 capital letter');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least 1 number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least 1 special character');
  }
    
    return errors;
}

// Show/Hide functions
function showLoginForm() {
    const loginContainer = document.getElementById('loginContainer');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (loginContainer) loginContainer.style.display = 'flex';
    if (adminDashboard) adminDashboard.style.display = 'none';
}

function showDashboard() {
    const loginContainer = document.getElementById('loginContainer');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (loginContainer) loginContainer.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    
    // Initialize dashboard
    initializeNavigation();
    loadAllSections();
}
// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found!');
    return;
  }
    
    // Password toggle functionality
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('adminPassword');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
    
    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const loginError = document.getElementById('loginError');
        
        // Clear previous error
        loginError.textContent = '';
        loginError.classList.remove('show');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            loginError.textContent = 'Please enter a valid email address.';
            loginError.classList.add('show');
            return;
        }
        
        // Validate password requirements
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            loginError.textContent = passwordErrors.join('. ');
            loginError.classList.add('show');
            return;
        }
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password: password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                showDashboard();
            } else {
                loginError.textContent = data.error || 'Invalid email or password. Please check your credentials.';
                loginError.classList.add('show');
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = 'Network error. Please try again.';
            loginError.classList.add('show');
        }
    });
}

// --- Section definitions ---
const sections = [
  { key: 'about', label: 'About', columns: [] },
  { key: 'research-verticals', label: 'Research Verticals', columns: [] },
  { key: 'people', label: 'People', columns: [] },
  { key: 'projects', label: 'Projects', columns: [] },
  { key: 'achievements', label: 'Achievements', columns: [] },
  { key: 'publications', label: 'Publications', columns: [] },
  { key: 'teaching', label: 'Teaching', columns: [] },
  { key: 'open-positions', label: 'Open Positions', columns: [] }
];

// --- Navigation logic ---
function initializeNavigation() {
  document.querySelectorAll(".nav-item").forEach(item => {
    const section = item.getAttribute("data-section");
    item.style.display = ""; // Show all nav items again
    item.addEventListener("click", function() {
      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      this.classList.add("active");
      showSection(section);
    });
  });
}

function showSection(sectionKey) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
  // Show selected section
  const selectedSection = document.getElementById(sectionKey + "Section");
  if (selectedSection) {
    selectedSection.classList.add("active");
  }
  // Refresh the table data (will be empty for all except about)
  const section = sections.find(s => s.key === sectionKey);
  if (section) {
  renderSectionTable(section);
    }
}

// --- Load all sections on dashboard load ---
function loadAllSections() {
  sections.forEach(section => {
    renderSectionTable(section);
  });
}

// --- API Helper ---
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = { 
    method, 
    headers: { 'Content-Type': 'application/json' } 
  };
  if (body) options.body = JSON.stringify(body);

    // Use port 3002 for the API
    const url = endpoint.startsWith('http') ? endpoint : `http://localhost:3002${endpoint}`;
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.status !== 204 ? res.json() : null;
}

// --- Render section table ---
async function renderSectionTable(section) {
  const table = document.getElementById(section.key + 'Table');
  if (!table) return;

  if (section.key === 'about') {
    // Use your requested content as the default
    const defaultOverview = `The Symbiotic Intelligence Research Group (SIRG) aims towards transdisciplinary research by augmenting human intelligence with the capabilities of intelligent information systems. The acronym 'SIRG' is pronounced as 'Surge', conveying dynamism and a leap towards innovation and progress. Symbiotic intelligence is considered the future of Artificial Intelligence. Our missions is to design, develop, and validate solutions through the deployment of connected and cooperative intelligence by exploring the potential of intelligent communication systems. The group focuses on applied research using cooperation, coordination, and communication techniques to solve problems for autonomous systems.`;

    let overview = '';
    try {
      const data = await apiRequest('/api/about');
      overview = data?.overview?.trim() ? data.overview : defaultOverview;
    } catch (e) {
      overview = defaultOverview;
    }

    table.innerHTML = `
            <div style="width: 100%; box-sizing: border-box; padding: 0;">
                <div id="aboutCard" style="
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                    padding: 3.5rem 3.5rem 3.5rem 3.5rem;
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                ">
                    <h2 style="font-size: 2.1rem; font-weight: bold; color: #28a745; margin-bottom: 1.2rem; text-align: center;">
          Symbiotic Intelligence Research Group
        </h2>
                    <div style="font-size: 1.3rem; color: #28a745; font-weight: 600; margin-bottom: 1.5rem; text-align: left;">Overview</div>
          <textarea
            id="aboutOverviewTextarea"
                        style="
                            width: 100%;
                            background: #f8f9fa;
                            border: 2px solid #e9ecef;
                            outline: none;
                            font-size: 1rem;
                            color: #333;
                            border-radius: 8px;
                            padding: 1.2rem;
                            resize: none;
                            overflow: hidden;
                            box-sizing: border-box;
                            word-wrap: break-word;
                            min-height: 120px;
                            line-height: 1.5;
                            font-family: 'Inter', sans-serif;
                            transition: border-color 0.3s ease;
                        "
                        rows="8"
          >${overview}</textarea>
                    <div style="margin-top: 1.5rem; text-align: right;">
                        <button id="aboutUpdateBtn" style="
                            background: #28a745;
                            color: #fff;
                            border: none;
                            border-radius: 6px;
                            padding: 0.7rem 1.5rem;
                            font-size: 0.95rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.15);
                        ">Update</button>
                    </div>
                    <div id="aboutUpdateMsg" style="margin-top: 0.7rem; font-size: 0.85rem; color: #e74c3c; text-align: center;"></div>
        </div>
      </div>
    `;

        // Auto-resize textarea to fit content, and let the card grow vertically up to main-content scroll
    const textarea = document.getElementById('aboutOverviewTextarea');
        const card = document.getElementById('aboutCard');
        if (textarea && card) {
            function autoResize() {
      textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
                card.style.minHeight = (textarea.scrollHeight + 200) + 'px';
            }
            autoResize();
            textarea.addEventListener('input', autoResize);

            textarea.addEventListener('focus', function() {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
      });
            textarea.addEventListener('blur', function() {
                this.style.borderColor = '#e9ecef';
                this.style.boxShadow = 'none';
            });
    }

    setTimeout(() => {
      const updateBtn = document.getElementById('aboutUpdateBtn');
      const msgDiv = document.getElementById('aboutUpdateMsg');

      updateBtn.onclick = async function() {
        updateBtn.disabled = true;
                updateBtn.textContent = 'Updating...';
                msgDiv.textContent = 'Updating overview...';
        msgDiv.style.color = '#888';
        try {
                    const overview = document.getElementById('aboutOverviewTextarea').value;
                    const token = localStorage.getItem('adminToken');
                    await updateOverview(overview, token);
          msgDiv.style.color = '#28a745';
          msgDiv.textContent = 'Overview updated successfully!';
                    updateBtn.textContent = 'Update';
        } catch (e) {
          msgDiv.style.color = '#e74c3c';
          msgDiv.textContent = 'Error updating overview: ' + e.message;
                    updateBtn.textContent = 'Update';
        }
        updateBtn.disabled = false;
      };
    }, 0);
    return;
  }

  if (section.key === 'projects') {
    table.style.background = '#f5f5f5';

    // --- Persistent project categories using localStorage ---
    function getProjectCategories() {
      const saved = localStorage.getItem('projectCategories');
      if (saved) return JSON.parse(saved);
      return [
        {
          name: "B.Tech",
          subProjects: [
            "Collaborative Deployment Strategy for Hybrid Computation in the IoT Environment",
            "Smart Waste Management Unit with Automated Waste Segregation",
            "StockEase: LNMIIT Stores Management Portal",
            "Art Style: Identification, Conversion and Plagiarism Detection"
          ]
        }
      ];
    }
    function setProjectCategories(arr) {
      localStorage.setItem('projectCategories', JSON.stringify(arr));
    }

    let projectCategories = getProjectCategories();
    const btechDefault = {
      name: "B.Tech",
      subProjects: [
        "Collaborative Deployment Strategy for Hybrid Computation in the IoT Environment",
        "Smart Waste Management Unit with Automated Waste Segregation",
        "StockEase: LNMIIT Stores Management Portal",
        "Art Style: Identification, Conversion and Plagiarism Detection"
      ]
    };
    if (!projectCategories.some(c => c.name === btechDefault.name)) {
      projectCategories.unshift(btechDefault);
      setProjectCategories(projectCategories);
    }

    // Unique IDs for elements
    const searchInputId = "projectCategorySearchInput";
    const searchResultsId = "projectCategorySearchResults";
    const addCardId = "addProjectCategoryCard";
    const categoryNameInputId = "categoryNameInput";
    const subProjectInputId = "subProjectInput";
    const subProjectListId = "subProjectList";
    const addSubProjectBtnId = "addSubProjectBtn";
    const addCategoryBtnId = "addCategoryBtn";

    // Helper to render a project category card
    function renderCategoryCard(cat, idx) {
      const cardId = `projectCard_${idx}`;
      const arrowId = `arrow_${idx}`;
      const contentId = `content_${idx}`;
      const editId = `edit_${idx}`;
      const deleteId = `delete_${idx}`;
      return `
        <div id="${cardId}" style="
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 1.5em 2em 1.5em 2em;
          width: 100%;
          margin: 0 auto 2em auto;
          text-align: left;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-weight: bold; color: #111; font-size: 1.15rem;">
              ${cat.name}
            </div>
            <div style="display: flex; align-items: center; gap: 0.7em;">
              <button id="${arrowId}" style="
                background: none;
                border: none;
                font-size: 1.3rem;
                cursor: pointer;
                margin-right: 0.5em;
                transition: transform 0.2s;
                display: flex;
                align-items: center;
              " title="Show/Hide Projects">
                <span style="display: inline-block; transition: transform 0.2s;">&#9660;</span>
              </button>
              <button id="${editId}" style="
                background: #ffe066;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 0.5em 1.1em;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
              ">Edit</button>
              <button id="${deleteId}" style="
                background: #ff4d4f;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 0.5em 1.1em;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
              ">Delete</button>
            </div>
          </div>
          <div id="${contentId}" style="margin-top: 1.2em; display: none;">
            <ul style="padding-left: 1.2em; margin: 0;">
              ${cat.subProjects.map(sp => `
                <li style="margin-bottom: 0.7em; font-size: 1.05rem; list-style-type: disc; list-style-position: inside;">
                  ${sp}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }
    // Helper to render the Edit Modal (with dynamic index)
    function renderEditModal(cat, idx) {
      const editModalId = `editProjectCategoryModal_${idx}`;
      const editCategoryNameInputId = `editCategoryNameInput_${idx}`;
      const editSubProjectInputId = `editSubProjectInput_${idx}`;
      const editAddSubProjectBtnId = `editAddSubProjectBtn_${idx}`;
      const editSubProjectListId = `editSubProjectList_${idx}`;
      const editUpdateBtnId = `editUpdateBtn_${idx}`;
      const editCancelBtnId = `editCancelBtn_${idx}`;
      return `
        <div id="${editModalId}" style="
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.13);
            padding: 2.2em 2.2em 2em 2.2em;
            min-width: 480px;
            max-width: 98vw;
            width: 700px;
            margin-top: 2.5em;
            margin-bottom: 2.5em;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 0.90rem;
            left: 10vw;
          ">
            <div style="font-weight: bold; color: #111; font-size: 1.08rem; margin-bottom: 1em;">
              Edit Project Category
            </div>
            <div style="color: #222; font-size: 0.92rem; font-weight: 500; margin-bottom: 0.4em;">
              Category Name
            </div>
            <input
              id="${editCategoryNameInputId}"
              type="text"
              value="${cat.name}"
              style="
                width: 100%;
                margin-bottom: 1em;
                padding: 0.6em 1em;
                font-size: 0.90rem;
                border: 1.5px solid #ccc;
                border-radius: 7px;
                outline: none;
                box-sizing: border-box;
                background: #f8f9fa;
              "
            />
            <div style="color: #222; font-size: 0.92rem; font-weight: 500; margin-bottom: 0.4em;">
              Sub-Projects
            </div>
            <div style="display: flex; align-items: center; width: 100%; margin-bottom: 0.8em;">
              <input
                id="${editSubProjectInputId}"
                type="text"
                placeholder="Enter a sub-project"
                style="
                  flex: 1;
                  padding: 0.6em 1em;
                  font-size: 0.90rem;
                  border: 1.5px solid #ccc;
                  border-radius: 7px 0 0 7px;
                  outline: none;
                  box-sizing: border-box;
                  background: #f8f9fa;
                "
              />
              <button id="${editAddSubProjectBtnId}" style="
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 0 7px 7px 0;
                padding: 0.6em 1.2em;
                font-size: 0.90rem;
                font-weight: 600;
                cursor: pointer;
                margin-left: 0.7em;
                transition: background 0.2s;
              ">Add</button>
            </div>
            <div id="${editSubProjectListId}" style="width: 100%; margin-bottom: 1em;">
              ${cat.subProjects.map((sp, sidx) => `
                <div style="
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.4em;
                  background: #f5f5f5;
                  border-radius: 7px;
                  padding: 0.5em 1em;
                  font-size: 0.85rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  min-height: 1.5em;
                ">
                  <li style="flex: 1; color: #333; list-style-type: disc; list-style-position: inside; margin-left: 1em; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${sp}
                  </li>
                  <button data-idx="${sidx}" style="background: none; border: none; color: #e74c3c; font-size: 1.05rem; cursor: pointer; margin-left: 0.5em;" title="Remove">&times;</button>
                </div>
              `).join('')}
            </div>
            <div style="display: flex; width: 100%; justify-content: flex-end; gap: 1em; margin-top: 1.2em;">
              <button id="${editUpdateBtnId}" style="
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 7px;
                padding: 0.7em 1.5em;
                font-size: 0.90rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
              ">Update</button>
              <button id="${editCancelBtnId}" style="
                background: #f2f2f2;
                color: #222;
                border: none;
                border-radius: 7px;
                padding: 0.7em 1.5em;
                font-size: 0.90rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
              ">Cancel</button>
            </div>
          </div>
        </div>
      `;
    }

    // Main render
    function renderProjectsSection(filterText = "") {
      // Filter project categories by name or sub-projects
      const filteredCategories = projectCategories.filter(cat =>
        cat.name.toLowerCase().includes(filterText) ||
        cat.subProjects.some(sp => sp.toLowerCase().includes(filterText))
      );

  table.innerHTML = `
    <tbody>
          <tr>
            <td style="padding: 48px 0 0 0; text-align: center; border: none;">
              <div style="font-weight: bold; color: #111; font-size: 2.2rem; margin-bottom: 0.5em;">
                Manage Projects
              </div>
              <div style="color: #888; font-size: 1rem; margin-bottom: 1.2em;">
                Add, edit, or remove project categories and their sub-projects.
              </div>
              <div style="width: 100%;">
                <div style="position: relative; width: 100%;">
                  <input
                    id="${searchInputId}"
                    type="text"
                    placeholder="Search project categories..."
                    style="
                      width: 100%;
                      padding: 0.9em 2.5em 0.9em 1em;
                      font-size: 1.1rem;
                      border: 1.5px solid #ccc;
                      border-radius: 8px;
                      outline: none;
                      box-sizing: border-box;
                      background: #fff;
                      transition: border-color 0.2s;
                    "
                  />
                  <span style="
                    position: absolute;
                    right: 1em;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #888;
                    font-size: 1.2em;
                    pointer-events: none;
                  ">
                    &#128269;
                  </span>
                </div>
              </div>
              <div id="${searchResultsId}" style="margin-top: 2em; text-align: left; width: 100%;"></div>
              <div style="height: 1em;"></div> <!-- Smaller standard space here -->
              <div style="height: 2em;"></div>
              <!-- Add New Project Category Card -->
              <div id="${addCardId}" style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                padding: 2.2em 2em 2em 2em;
                width: 100%;
                margin: 0 auto;
                text-align: left;
                box-sizing: border-box;
              ">
                <div style="font-weight: bold; color: #111; font-size: 1.25rem;">
                  Add New Project Category
                </div>
                <div style="height: 1em;"></div>
                <div style="color: #222; font-size: 1.02rem; font-weight: 500;">
                  Category Name
                </div>
                <input
                  id="${categoryNameInputId}"
                  type="text"
                  placeholder="Enter category name"
                  style="
                    width: 100%;
                    margin-top: 0.5em;
                    padding: 0.7em 1em;
                    font-size: 1rem;
                    border: 1.5px solid #ccc;
                    border-radius: 7px;
                    outline: none;
                    box-sizing: border-box;
                    background: #f8f9fa;
                    margin-bottom: 1.2em;
                  "
                />
                <div style="color: #222; font-size: 1.02rem; font-weight: 500;">
                  Sub-Projects
                </div>
                <div style="display: flex; align-items: center; width: 100%; margin-top: 0.5em;">
                  <input
                    id="${subProjectInputId}"
                    type="text"
                    placeholder="Enter a sub-project"
                    style="
                      flex: 1;
                      padding: 0.7em 1em;
                      font-size: 1rem;
                      border: 1.5px solid #ccc;
                      border-radius: 7px 0 0 7px;
                      outline: none;
                      box-sizing: border-box;
                      background: #f8f9fa;
                    "
                  />
                  <button id="${addSubProjectBtnId}" style="
                    background: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 0 7px 7px 0;
                    padding: 0.7em 1.2em;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-left: 0.7em;
                    transition: background 0.2s;
                  ">Add</button>
                </div>
                <div id="${subProjectListId}" style="width: 100%; margin-top: 1em; margin-bottom: 1em;"></div>
                <button id="${addCategoryBtnId}" style="
                  margin-top: 0.4em;
                  background: #222;
                  color: #fff;
                  border: none;
                  border-radius: 7px;
                  padding: 0.8em 1.5em;
                  font-size: 1.08rem;
                  font-weight: 600;
                  cursor: pointer;
                  width: auto;
                  min-width: 220px;
                  transition: background 0.2s;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                ">
                  + Add Project Category
                </button>
              </div>
              <div style="height: 2em;"></div>
              <!-- Project Cards Container -->
              <div id="projectCardsContainer">
                ${
                  filteredCategories.length > 0
                    ? filteredCategories.map((cat, idx) => renderCategoryCard(cat, idx)).join('')
                    : `<div style="color: #e74c3c; font-size: 1.05rem; text-align: center; margin-top: 2em;">
                        No project categories found matching your search.
                      </div>`
                }
              </div>
          </td>
        </tr>
    </tbody>
  `;
      // --- Add logic for Add New Project Category card ---
      // Temporary sub-projects array for the add card
      let newSubProjects = [];
      const subProjectInput = document.getElementById(subProjectInputId);
      const addSubProjectBtn = document.getElementById(addSubProjectBtnId);
      const subProjectListDiv = document.getElementById(subProjectListId);
      const categoryNameInput = document.getElementById(categoryNameInputId);
      const addCategoryBtn = document.getElementById(addCategoryBtnId);

      function renderSubProjectList() {
        subProjectListDiv.innerHTML = newSubProjects.map((sp, idx) => `
          <div style="display: flex; align-items: center; margin-bottom: 0.4em; background: #f5f5f5; border-radius: 7px; padding: 0.5em 1em; font-size: 0.95rem;">
            <li style="flex: 1; color: #333; list-style-type: disc; list-style-position: inside; margin-left: 1em; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${sp}
            </li>
            <button data-idx="${idx}" style="background: none; border: none; color: #e74c3c; font-size: 1.05rem; cursor: pointer; margin-left: 0.5em;" title="Remove">&times;</button>
          </div>
        `).join("");
        // Remove sub-project logic
        subProjectListDiv.querySelectorAll('button[data-idx]').forEach(btn => {
          btn.onclick = function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            newSubProjects.splice(idx, 1);
            renderSubProjectList();
          };
        });
      }
      addSubProjectBtn.onclick = function() {
        const val = subProjectInput.value.trim();
        if (val) {
          newSubProjects.push(val);
          subProjectInput.value = '';
          renderSubProjectList();
        }
        subProjectInput.focus();
      };
      subProjectInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          addSubProjectBtn.click();
        }
      });
      addCategoryBtn.onclick = function() {
        const name = categoryNameInput.value.trim();
        if (!name) {
          categoryNameInput.focus();
          return;
        }
        if (projectCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
          categoryNameInput.value = '';
          categoryNameInput.placeholder = 'Category already exists!';
          categoryNameInput.focus();
          return;
        }
        projectCategories.push({ name, subProjects: [...newSubProjects] });
        setProjectCategories(projectCategories);
        // Reset form
        categoryNameInput.value = '';
        newSubProjects = [];
        renderSubProjectList();
        renderProjectsSection();
      };
      renderSubProjectList();
      // --- End add logic ---
      bindCategoryCardEvents(filteredCategories);
    }

    // --- Bind all project category card and modal events ---
    function bindCategoryCardEvents(filteredCategories = projectCategories) {
      filteredCategories.forEach((cat, idx) => {
        const arrowBtn = document.getElementById(`arrow_${idx}`);
        const contentDiv = document.getElementById(`content_${idx}`);
        const arrowSpan = arrowBtn.querySelector('span');
        let open = false;
        arrowBtn.onclick = function() {
          open = !open;
          contentDiv.style.display = open ? 'block' : 'none';
          arrowSpan.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
        };

        // Delete
        const deleteBtn = document.getElementById(`delete_${idx}`);
        deleteBtn.onclick = function() {
          projectCategories.splice(idx, 1);
          setProjectCategories(projectCategories);
          renderProjectsSection();
        };

        // Edit
        const editBtn = document.getElementById(`edit_${idx}`);
        editBtn.onclick = function() {
          // Show modal
          const modal = document.createElement('div');
          modal.innerHTML = renderEditModal(cat, idx);
          document.body.appendChild(modal);

          let editSubProjects = [...cat.subProjects];

          // Remove sub-project logic
          function renderEditSubProjects() {
            const list = modal.querySelector(`#editSubProjectList_${idx}`);
            list.innerHTML = editSubProjects.map((sp, sidx) =>
              `<div style="
                display: flex;
                align-items: center;
                margin-bottom: 0.4em;
                background: #f5f5f5;
                border-radius: 7px;
                padding: 0.5em 1em;
                font-size: 0.85rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 1.5em;
              ">
                <li style="flex: 1; color: #333; list-style-type: disc; list-style-position: inside; margin-left: 1em; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${sp}
                </li>
                <button data-idx="${sidx}" style="background: none; border: none; color: #e74c3c; font-size: 1.05rem; cursor: pointer; margin-left: 0.5em;" title="Remove">&times;</button>
              </div>`
            ).join('');
            list.querySelectorAll('button[data-idx]').forEach(btn => {
              btn.onclick = function() {
                const sidx = parseInt(this.getAttribute('data-idx'));
                editSubProjects.splice(sidx, 1);
                renderEditSubProjects();
              };
            });
          }
          renderEditSubProjects();

          // Add sub-project logic
          const editSubProjectInput = modal.querySelector(`#editSubProjectInput_${idx}`);
          const editAddSubProjectBtn = modal.querySelector(`#editAddSubProjectBtn_${idx}`);
          editAddSubProjectBtn.onclick = function() {
            const val = editSubProjectInput.value.trim();
            if (val) {
              editSubProjects.push(val);
              editSubProjectInput.value = '';
              renderEditSubProjects();
            }
            editSubProjectInput.focus();
          };
          editSubProjectInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
              editAddSubProjectBtn.click();
            }
          });

          // Update and Cancel logic
          modal.querySelector(`#editUpdateBtn_${idx}`).onclick = function() {
            const newName = modal.querySelector(`#editCategoryNameInput_${idx}`).value.trim();
            if (!newName) {
              modal.querySelector(`#editCategoryNameInput_${idx}`).focus();
              return;
            }
            projectCategories[idx] = {
              name: newName,
              subProjects: [...editSubProjects]
            };
            setProjectCategories(projectCategories);
            document.body.removeChild(modal);
            renderProjectsSection();
          };
          modal.querySelector(`#editCancelBtn_${idx}`).onclick = function() {
            document.body.removeChild(modal);
          };
        };
      });
    }

    // --- Add search/filter functionality ---
    setTimeout(() => {
      const input = document.getElementById(searchInputId);

      input.addEventListener('input', function() {
        const val = input.value.trim().toLowerCase();
        renderProjectsSection(val);
      });

      // ... rest of your add sub-project/category logic ...
    }, 0);

    // Initial render
    renderProjectsSection();
  } else if (section.key === 'people') {
    table.style.background = '#f5f5f5';
    // Set the whole section background to light grey
    const peopleSection = document.getElementById('peopleSection');
    if (peopleSection) {
      peopleSection.style.background = '#f5f5f5';
      peopleSection.style.minHeight = '100vh';
    }
    // --- Add New Person Card ---
    table.innerHTML = `
      <tbody>
        <tr>
          <td style="padding: 48px 0 0 0; text-align: center; border: none;">
            <div style="font-weight: bold; color: #111; font-size: 2.2rem; margin-bottom: 0.5em; text-align: center;">
              Manage People
            </div>
            <div style="color: #888; font-size: 1rem; margin-bottom: 2.5em; text-align: center;">
              Add, edit, or remove people from your organization.
            </div>
            <div id="addPersonCard" style="display: flex; flex-direction: row; justify-content: flex-start; align-items: stretch; background: #fff; border-radius: 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); padding: 2.5rem 2.5rem 2.5rem 2.5rem; width: 900px; max-width: 98vw; margin: 0 auto 2.5em auto; min-height: 520px; position: relative;">
              <!-- Left Side -->
              <div style="flex: 2; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; position: relative;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #222; margin-bottom: 1.2rem;">Add New Person</div>
                <div style="display: flex; flex-direction: row; width: 100%; gap: 2.5em; align-items: flex-end;">
                  <div style="width: 50%; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em;">
                    <label for="personNameInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Name</label>
                    <input id="personNameInput" type="text" placeholder="Enter name" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" />
                  </div>
                  <div style="width: 50%; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em; position: relative;">
                    <label for="personRoleInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Role</label>
                    <div id="personRoleInput" tabindex="0" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; display: flex; align-items: center; cursor: pointer; position: relative; box-sizing: border-box;">
                      <span id="personRoleSelected">Select Role</span>
                      <span style="margin-left: auto; color: #888; font-size: 1.2em; display: flex; align-items: center;">
                        <svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
                      </span>
                    </div>
                    <div id="personRoleDropdown" style="display: none; position: absolute; left: 0; top: 100%; z-index: 10; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.13); margin-top: 0.3em; min-width: 100%; overflow: hidden;">
                      <div class="role-option" data-role="Faculty" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">Faculty</div>
                      <div class="role-option" data-role="PhD Researcher" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">PhD Researcher</div>
                      <div class="role-option" data-role="M.Tech. Researcher" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">M.Tech. Researcher</div>
                      <div class="role-option" data-role="Student" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">Student</div>
                      <div class="role-option" data-role="Research Associate" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">Research Associate</div>
                      <div class="role-option" data-role="Other" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">Other</div>
                    </div>
                  </div>
                </div>
                <div id="addPersonRollNumberField" style="display: none; margin-top: 1.2em; width: 100%;">
                  <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-width: 100%;">
                    <label for="addPersonRollNumberInput" style="font-size: 0.92rem; color: #444; margin-bottom: 0.3em;">Roll Number</label>
                    <input id="addPersonRollNumberInput" type="text" placeholder="Enter roll number" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" />
                  </div>
                </div>
                <div class="show-in-people-row" style="margin-top:10px;">
                  <label for="addShowInPeopleCheckbox" class="custom-checkbox-label">
                    <input type="checkbox" id="addShowInPeopleCheckbox" style="display:none;">
                    <span class="custom-checkbox"></span>
                    Show in People Page
                  </label>
                </div>
                <div style="margin-top: 1.2em; width: 100%;">
                  <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-width: 100%;">
                    <label for="personInfoInput" style="font-size: 0.92rem; color: #444; margin-bottom: 0.3em;">Info</label>
                    <textarea id="personInfoInput" placeholder="To create bullet points, separate each point with a semicolon (;)" style="width: 100%; height: 28px; font-size: 0.9rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.3em 0.8em; outline: none; transition: border-color 0.3s; margin-top: 0.3em; resize: none; overflow: hidden; box-sizing: border-box; line-height: 1.2;"></textarea>
                  </div>
                </div>
                <div style="margin-top: 1.2em; width: 100%;">
                  <div style="display: flex; flex-direction: column; align-items: flex-start; width: 85%; min-width: 280px; max-width: 500px;">
                    <div style="margin-bottom: 0.3em;">
                      <span style="font-size: 0.92rem; color: #444;">Social Links</span>
                    </div>
                    <div id="socialLinksContainer" style="width: 100%; margin-bottom: 0.7em;"></div>
                    <button id="addSocialLinkBtn" type="button" style="background: #28a745; color: #fff; border: none; border-radius: 7px; padding: 0.6em 1.3em; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5em;">
                      <span style="font-size: 1.2em;">+</span> Add Social Link
                    </button>
                  </div>
                </div>
                <div style="margin-top: 2.2em; width: 100%; display: flex; flex-direction: column; align-items: flex-start;">
                  <div id="personAvatarCircle" style="width: 110px; height: 110px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin-bottom: 1.1em; position: relative; overflow: hidden;">
                    <img id="personAvatarIcon" src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="avatar" style="width: 54px; height: 54px; object-fit: contain; filter: grayscale(100%) brightness(0.5);" />
                  </div>
                  <button id="uploadImageBtn" type="button" style="background: #007bff; color: #fff; border: none; border-radius: 7px; padding: 0.7em 1.5em; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.6em;">
                    <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20"><path d="M16.7 10.8c-.4 0-.7.3-.7.7v3.5c0 .4-.3.7-.7.7H4.7c-.4 0-.7-.3-.7-.7v-3.5c0-.4-.3-.7-.7-.7s-.7.3-.7.7v3.5c0 1.2 1 2.2 2.2 2.2h10.6c1.2 0 2.2-1 2.2-2.2v-3.5c0-.4-.3-.7-.7-.7z"/><path d="M10.7 12.7c.3.3.7.3 1 0l3.2-3.2c.3-.3.3-.7 0-1s-.7-.3-1 0l-1.8 1.8V3.7c0-.4-.3-.7-.7-.7s-.7.3-.7.7v6.6l-1.8-1.8c-.3-.3-.7-.3-1 0s-.3.7 0 1l3.2 3.2z"/></svg>
                    Upload Image
                  </button>
                  <input id="personImageInput" type="file" accept="image/*" style="display: none;" />
                </div>
              </div>
              <!-- Right Side (empty for now) -->
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;">
                <button id="createPersonBtn" type="button" style="background: #007bff; color: #fff; border: none; border-radius: 7px; padding: 0.7em 1.8em; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5em; margin-top: auto;">
                  Create Person
                </button>
              </div>
            </div>
            <div id="personCropModal" style="display: none;"></div>
            <!-- People Search Box -->
            <div style="display: flex; justify-content: center; margin: 36px auto 0 auto; width: 100%; max-width: 900px;">
              <div style="position: relative; width: 100%; max-width: 100%;">
                <input id="peopleAdminSearch" type="text" placeholder="Search people..." style="width: 100%; height: 40px; font-size: 1.08rem; color: #222; background: #fff; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 2.5em 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" autocomplete="off" />
                <span style="position: absolute; right: 0.9em; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    `;
    // --- Interactivity JS ---
    (function(){
      // Name input focus/blur
      const nameInput = document.getElementById('personNameInput');
      nameInput.addEventListener('focus', function(){ this.style.borderColor = '#007bff'; });
      nameInput.addEventListener('blur', function(){ this.style.borderColor = '#e9ecef'; });
      
      // Role dropdown functionality
      const roleInput = document.getElementById('personRoleInput');
      const roleDropdown = document.getElementById('personRoleDropdown');
      const roleSelected = document.getElementById('personRoleSelected');
      let selectedRole = '';
      let roleOpen = false;
      
      roleInput.addEventListener('click', function(e) {
        e.stopPropagation();
        roleDropdown.style.display = roleOpen ? 'none' : 'block';
        roleInput.style.borderColor = roleOpen ? '#e9ecef' : '#007bff';
        roleOpen = !roleOpen;
      });
      
      roleInput.addEventListener('focus', function() {
        this.style.borderColor = '#007bff';
      });
      
      roleInput.addEventListener('blur', function() {
        this.style.borderColor = '#e9ecef';
      });
      
      document.addEventListener('click', function() {
        roleDropdown.style.display = 'none';
        roleInput.style.borderColor = '#e9ecef';
        roleOpen = false;
      });
      
      Array.from(roleDropdown.getElementsByClassName('role-option')).forEach(option => {
        option.addEventListener('mouseenter', function() {
          this.style.background = '#e6f0ff';
        });
        option.addEventListener('mouseleave', function() {
          this.style.background = '#fff';
        });
        option.addEventListener('click', function(e) {
          e.stopPropagation();
          selectedRole = this.getAttribute('data-role');
          roleSelected.textContent = selectedRole;
          roleDropdown.style.display = 'none';
          roleInput.style.borderColor = '#e9ecef';
          roleOpen = false;
          updateAddRollNumberField();
        });
      });
      // Show in People Page checkbox
      const showCheckbox = document.getElementById('addShowInPeopleCheckbox');
      let showChecked = false;
      function renderShowCheckbox(){
        showCheckbox.innerHTML = showChecked ? `<svg width="16" height="16" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill="#007bff"/><path d="M6 10.5l3 3 5-5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>` : '';
        showCheckbox.style.borderColor = showChecked ? '#007bff' : '#e9ecef';
        showCheckbox.style.background = showChecked ? '#007bff22' : '#fff';
      }
      showCheckbox.addEventListener('click', function(){ showChecked = !showChecked; renderShowCheckbox(); });
      showCheckbox.addEventListener('keydown', function(e){ if(e.key===' '||e.key==='Enter'){ showChecked = !showChecked; renderShowCheckbox(); }});
      renderShowCheckbox();
      // Social Links
      const socialLinksContainer = document.getElementById('socialLinksContainer');
      const addSocialLinkBtn = document.getElementById('addSocialLinkBtn');
      let socialLinks = [];
      function renderSocialLinks(){
        socialLinksContainer.innerHTML = socialLinks.map((link, idx) => `
          <div style="display: flex; flex-direction: row; align-items: center; gap: 2em; margin-bottom: 0.7em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
            <div style="flex: 1.2; position: relative; min-width: 0;">
              <div class="social-type-input" tabindex="0" data-idx="${idx}" style="width: 100%; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.7em 1em; outline: none; transition: border-color 0.3s; display: flex; align-items: center; cursor: pointer; position: relative; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <span class="social-type-selected" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${link.type}</span>
                <span style="margin-left: auto; color: #888; font-size: 1.2em; display: flex; align-items: center;">
                  <svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
                </span>
              </div>
              <div class="social-type-dropdown" style="display: none; position: absolute; left: 0; top: 100%; z-index: 10; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.13); margin-top: 0.3em; min-width: 100%; overflow: hidden;">
                ${["Google Scholar","ORCID","Linkedin","Twitter","Github","Other"].map(type => `
                  <div class="social-type-option" data-type="${type}" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">
                    ${type}
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="flex: 3.5; min-width: 0;">
              <input class="social-url-input" type="text" placeholder="URL" value="${link.url || ''}"
                style="width: 100%; max-width: 600px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.7em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block;" />
            </div>
            <button class="delete-social-link-btn" data-idx="${idx}" type="button" style="background: #e74c3c; color: #fff; border: none; border-radius: 7px; padding: 0.6em 0.9em; font-size: 1.1em; font-weight: 600; cursor: pointer; display: flex; align-items: center;">
              <svg width="16" height="16" fill="#fff" viewBox="0 0 20 20"><path d="M6 6l8 8M6 14L14 6" stroke="#fff" stroke-width="2.2"/></svg>
            </button>
          </div>
        `).join('');
        // Dropdown logic for each social link
        Array.from(socialLinksContainer.getElementsByClassName('social-type-input')).forEach((el, idx) => {
          const dropdown = el.nextElementSibling;
          let open = false;
          el.addEventListener('click', function(e){
            e.stopPropagation();
            dropdown.style.display = open ? 'none' : 'block';
            el.style.borderColor = open ? '#e9ecef' : '#007bff';
            open = !open;
          });
          document.addEventListener('click', function(){ dropdown.style.display = 'none'; el.style.borderColor = '#e9ecef'; open = false; });
          Array.from(dropdown.getElementsByClassName('social-type-option')).forEach(opt => {
            opt.addEventListener('mouseenter', function(){ this.style.background = '#e6f0ff'; });
            opt.addEventListener('mouseleave', function(){ this.style.background = '#fff'; });
            opt.addEventListener('click', function(e){
              e.stopPropagation();
              socialLinks[idx].type = this.getAttribute('data-type');
              renderSocialLinks();
            });
          });
        });
        // URL input logic
        Array.from(socialLinksContainer.getElementsByClassName('social-url-input')).forEach((input, idx) => {
          input.addEventListener('focus', function(){ this.style.borderColor = '#007bff'; });
          input.addEventListener('blur', function(){ this.style.borderColor = '#e9ecef'; });
          input.addEventListener('input', function(){ socialLinks[idx].url = this.value; });
        });
        // Delete button logic
        Array.from(socialLinksContainer.getElementsByClassName('delete-social-link-btn')).forEach(btn => {
          btn.addEventListener('click', function(){
            const idx = parseInt(this.getAttribute('data-idx'));
            socialLinks.splice(idx, 1);
            renderSocialLinks();
          });
        });
      }
      addSocialLinkBtn.addEventListener('click', function(){
        socialLinks.push({ type: 'Google Scholar', url: '' });
        renderSocialLinks();
      });
      renderSocialLinks();
      // Image upload logic
      const avatarCircle = document.getElementById('personAvatarCircle');
      const avatarIcon = document.getElementById('personAvatarIcon');
      const uploadBtn = document.getElementById('uploadImageBtn');
      const fileInput = document.getElementById('personImageInput');
      const cropModal = document.getElementById('personCropModal');
      let avatarImgData = null;
      let cropper = null;
      uploadBtn.addEventListener('click', function(){ fileInput.click(); });
      fileInput.addEventListener('change', function(e){
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev){
          cropModal.style.display = 'flex';
          cropModal.style.position = 'fixed';
          cropModal.style.left = 0;
          cropModal.style.top = 0;
          cropModal.style.width = '100vw';
          cropModal.style.height = '100vh';
          cropModal.style.background = 'rgba(0,0,0,0.18)';
          cropModal.style.alignItems = 'center';
          cropModal.style.justifyContent = 'center';
          cropModal.innerHTML = `
            <div style="background: #fff; border-radius: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.13); padding: 2.2em 2.2em 2em 2.2em; min-width: 340px; max-width: 98vw; width: 420px; margin-top: 2.5em; margin-bottom: 2.5em; position: relative; display: flex; flex-direction: column; align-items: center; font-size: 0.90rem;">
              <img id="cropImagePreview" src="${ev.target.result}" style="width: 400px; height: 400px; max-width: 80vw; max-height: 60vh; object-fit: contain; border-radius: 12px; margin-bottom: 1.2em; background: #f0f0f0;" />
              <button id="saveCropBtn" style="background: #007bff; color: #fff; border: none; border-radius: 7px; padding: 0.7em 1.5em; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 1.2em;">Save Image</button>
              <span id="closeCropModal" style="position: absolute; top: 1.1em; right: 1.1em; cursor: pointer; color: #444; font-size: 1.5em;">&times;</span>
            </div>
          `;
          const cropImg = document.getElementById('cropImagePreview');
          // Wait for image to load before initializing cropper
          cropImg.onload = function() {
            if (cropper) { cropper.destroy(); cropper = null; }
            cropper = new Cropper(cropImg, {
              aspectRatio: 1,
              viewMode: 1,
              autoCropArea: 1,
              background: false,
              movable: true,
              zoomable: true,
              rotatable: false,
              scalable: false,
              responsive: true,
              dragMode: 'move',
              guides: true,
              highlight: true,
              cropBoxResizable: true,
              cropBoxMovable: true,
              minCropBoxWidth: 100,
              minCropBoxHeight: 100,
              ready: function() {
                // Ensure the crop box is properly sized
                const cropBoxData = cropper.getCropBoxData();
                if (cropBoxData.width < 100 || cropBoxData.height < 100) {
                  cropper.setCropBoxData({
                    width: Math.min(100, cropBoxData.width),
                    height: Math.min(100, cropBoxData.height)
                  });
                }
              }
            });
          };
          document.getElementById('closeCropModal').onclick = function(){
            cropModal.style.display = 'none';
            if (cropper) { cropper.destroy(); cropper = null; }
          };
          document.getElementById('saveCropBtn').onclick = function(){
            if (cropper) {
              // Get the crop box size in the original image
              const cropData = cropper.getData(true); // true = get data in original image scale
              const cropW = Math.round(cropData.width);
              const cropH = Math.round(cropData.height);
              
              // Output at higher resolution for better quality (220x220 = 2x the display size)
              const canvas = cropper.getCroppedCanvas({ 
                width: 220, 
                height: 220, 
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
                fillColor: '#ffffff'
              });
              
              avatarImgData = canvas.toDataURL('image/png', 1.0);
              avatarIcon.src = avatarImgData;
              avatarIcon.style.filter = 'none';
              avatarIcon.style.width = '100%';
              avatarIcon.style.height = '100%';
              avatarIcon.style.objectFit = 'cover';
              avatarIcon.style.borderRadius = '50%';
              avatarIcon.style.imageRendering = 'crisp-edges';
              cropper.destroy();
              cropper = null;
              cropModal.style.display = 'none';
            }
          };
        };
        reader.readAsDataURL(file);
      });
      // Create Person button logic
      const createPersonBtn = document.getElementById('createPersonBtn');
      const addPersonCard = document.getElementById('addPersonCard');
      let infoPointsDiv = document.getElementById('infoPointsDiv');
      if (!infoPointsDiv) {
        infoPointsDiv = document.createElement('div');
        infoPointsDiv.id = 'infoPointsDiv';
        addPersonCard.parentNode.insertBefore(infoPointsDiv, addPersonCard.nextSibling);
      }
      createPersonBtn.onclick = function() {
        // Gather data from Add New Person card
        const name = document.getElementById('personNameInput').value.trim();
        const role = document.getElementById('personRoleSelected').textContent.trim();
        const rollNumber = document.getElementById('personRollNumberInput')?.value.trim() || '';
        const info = document.getElementById('personInfoInput').value.trim();
        const imageSrc = document.getElementById('personAvatarIcon').src;
        const showInPeople = document.getElementById('addShowInPeopleCheckbox')?.checked || false;
        // Social links
        let socialLinks = [];
        if (window.socialLinks && Array.isArray(window.socialLinks)) {
          socialLinks = JSON.parse(JSON.stringify(window.socialLinks));
        }
        // Validate required fields
        if (!name || !role || role === 'Select Role') {
          alert('Please fill in all required fields.');
          return;
        }
        // Add new person to data
        let people = loadPeopleData();
        people.push({ name, role, rollNumber, info, imageSrc, socialLinks, showInPeople });
        savePeopleData(people);
        renderAllPeopleCards();
        // Clear form fields
        document.getElementById('personNameInput').value = '';
        document.getElementById('personRoleSelected').textContent = 'Select Role';
        document.getElementById('personRollNumberInput').value = '';
        document.getElementById('personInfoInput').value = '';
        document.getElementById('personAvatarIcon').src = 'https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png';
        if (window.socialLinks && Array.isArray(window.socialLinks)) {
          window.socialLinks = [];
          if (typeof window.renderSocialLinks === 'function') window.renderSocialLinks();
        }
        document.getElementById('addShowInPeopleCheckbox').checked = false;
        // Show info points as blue bullets below the card
        const infoInput = document.getElementById('personInfoInput');
        const infoVal = infoInput.value.trim();
        if (infoVal) {
          const points = infoVal.split(';').map(p => p.trim()).filter(Boolean);
          infoPointsDiv.innerHTML = `<ul style="margin: 1.5em 0 0 0; padding: 0; list-style: none;">${points.map(p => `<li style='display: flex; align-items: flex-start; margin-bottom: 0.5em;'><span style='display: inline-block; width: 10px; height: 10px; background: #007bff; border-radius: 50%; margin-right: 0.7em; margin-top: 0.35em;'></span><span style='color: #222; font-size: 1rem;'>${p}</span></li>`).join('')}</ul>`;
        } else {
          infoPointsDiv.innerHTML = '';
        }
      };
      // People search box focus/blur and placeholder logic
      const peopleSearch = document.getElementById('peopleAdminSearch');
      if (peopleSearch) {
        peopleSearch.addEventListener('focus', function() {
          this.style.borderColor = '#007bff';
        });
        peopleSearch.addEventListener('blur', function() {
          this.style.borderColor = '#e9ecef';
        });
        peopleSearch.addEventListener('input', function() {
          if (this.value.length > 0) {
            this.setAttribute('placeholder', '');
          } else {
            this.setAttribute('placeholder', 'Search people...');
          }
        });
      }
      // Edit Person Modal Functionality
      const editPersonBtn = document.getElementById('editSaurabhKumarBtn');
      const editPersonModal = document.getElementById('editPersonModal');
      const closeEditModal = document.getElementById('closeEditModal');
      const saveEditPersonBtn = document.getElementById('saveEditPersonBtn');
      const cancelEditPersonBtn = document.getElementById('cancelEditPersonBtn');
      console.log('Looking for edit button:', editPersonBtn);
      console.log('Looking for edit modal:', editPersonModal);
      
      // Check if elements exist
      if (editPersonBtn && editPersonModal && closeEditModal && saveEditPersonBtn) {
        console.log('Edit modal elements found successfully');
        
        // Open edit modal
        editPersonBtn.addEventListener('click', function() {
          console.log('Edit button clicked');
          
          // Show modal first
          editPersonModal.style.display = 'flex';
          console.log('Modal should be visible now');
          
          // Check if elements exist after modal is shown
          const editPersonRoleSelected = document.getElementById('editPersonRoleSelected');
          const editPersonRoleDropdown = document.getElementById('editPersonRoleDropdown');
          console.log('Elements after modal shown:', {
            editPersonRoleSelected: !!editPersonRoleSelected,
            editPersonRoleDropdown: !!editPersonRoleDropdown
          });
          
          // Get current values from the main card
          const mainCard = document.getElementById('saurabhKumarCard');
          let currentName = 'Dr. Saurabh Kumar';
          let currentRole = 'Faculty Coordinator';
          let currentInfo = 'Assistant Professor, Department of CSE, LNMIIT Jaipur';
          let currentImageSrc = 'Dr_Saurabh_Kumar.png';
          let currentRollNumber = '';
          
          if (mainCard) {
            // Get current name
            const nameSpan = mainCard.querySelector('span[style*="font-weight: 600; color: #111; font-size: 1.13rem"]');
            if (nameSpan) {
              currentName = nameSpan.textContent;
            }
            
            // Get current info
            const infoSpan = mainCard.querySelector('ul li span[style*="color: #888; font-size: 0.97rem; white-space: nowrap"]');
            if (infoSpan) {
              currentInfo = infoSpan.textContent;
            }
            
            // Get current role and roll number from badge
            const roleBadge = mainCard.querySelector('#mainCardRoleBadge');
            if (roleBadge) {
              const badgeText = roleBadge.textContent;
              if (badgeText.includes(' - ')) {
                const parts = badgeText.split(' - ');
                currentRole = parts[0];
                currentRollNumber = parts[1];
              } else {
                currentRole = badgeText;
                currentRollNumber = '';
              }
            }
            
            // Get current image
            const profileImage = mainCard.querySelector('img[alt="Dr. Saurabh Kumar"]');
            if (profileImage) {
              currentImageSrc = profileImage.src;
            }
          }
          
          console.log('Current values from main card:', {
            name: currentName,
            role: currentRole,
            info: currentInfo,
            imageSrc: currentImageSrc,
            rollNumber: currentRollNumber
          });
          
          // Populate modal with current data from main card
          const editNameInput = document.getElementById('editPersonNameInput');
          const editInfoInput = document.getElementById('editPersonInfoInput');
          const editAvatarIcon = document.getElementById('editPersonAvatarIcon');
          const editRollNumberInput = document.getElementById('editRollNumberInput');
          
          if (editNameInput) editNameInput.value = currentName;
          if (editPersonRoleSelected) editPersonRoleSelected.textContent = currentRole;
          if (editInfoInput) editInfoInput.value = currentInfo;
          if (editAvatarIcon) editAvatarIcon.src = currentImageSrc;
          if (editRollNumberInput) editRollNumberInput.value = currentRollNumber;
          
          // Show/hide roll number field based on current role
          const editRollField = document.getElementById('editRollNumberField');
          if (editRollField) {
            const roleLower = currentRole.toLowerCase();
            const rolesWithRollNumber = ['phd researcher', 'm.tech. researcher', 'student'];
            
            if (rolesWithRollNumber.includes(roleLower)) {
              editRollField.style.display = 'flex';
              console.log('Roll number field shown for role:', currentRole);
            } else {
              editRollField.style.display = 'none';
              console.log('Roll number field hidden for role:', currentRole);
            }
          }
          
          // Initialize edit modal functionality
          console.log('Calling initializeEditModal...');
          // Add a small delay to ensure modal is fully rendered
          setTimeout(() => {
            initializeEditModal();
            console.log('initializeEditModal called');
            
            // Initialize social links in the edit modal
            if (typeof window.editSocialLinks === 'undefined') {
              window.editSocialLinks = [];
            }
            window.renderEditSocialLinks();
            console.log('Social links initialized in edit modal with', window.editSocialLinks.length, 'links');
          }, 100);
          
          // Test the selectRole function
          // selectRole function is now defined globally at the top of the file
        });
        
        // Close edit modal
        closeEditModal.addEventListener('click', function() {
          editPersonModal.style.display = 'none';
        });
        
        // Cancel button functionality
        cancelEditPersonBtn.addEventListener('click', function() {
          console.log('=== CANCEL BUTTON CLICKED VIA EVENT LISTENER ===');
          cancelEditPerson();
        });
        
        // Close modal when clicking outside
        editPersonModal.addEventListener('click', function(e) {
          if (e.target === editPersonModal) {
            editPersonModal.style.display = 'none';
          }
        });
        
        // Save changes
        saveEditPersonBtn.addEventListener('click', function() {
          console.log('=== UPDATE PERSON CLICKED VIA EVENT LISTENER ===');
          updatePerson();
        });
      } else {
        console.error('Some edit modal elements not found:', {
          editPersonBtn: !!editPersonBtn,
          editPersonModal: !!editPersonModal,
          closeEditModal: !!closeEditModal,
          saveEditPersonBtn: !!saveEditPersonBtn
        });
      }
      
      // selectRole function is now defined globally at the top of the file
      
      function initializeEditModal() {
        // Role dropdown functionality
        const editRoleInput = document.getElementById('editPersonRoleInput');
        const editRoleDropdown = document.getElementById('editPersonRoleDropdown');
        const editRoleSelected = document.getElementById('editPersonRoleSelected');
        const editRollField = document.getElementById('editRollNumberField');
        let editRoleOpen = false;
        let editSelectedRole = '';
        
        console.log('Initializing edit modal role dropdown:', {
          editRoleInput: !!editRoleInput,
          editRoleDropdown: !!editRoleDropdown,
          editRoleSelected: !!editRoleSelected
        });
        
        // Role dropdown functionality - exactly like Add New Person card
        
        // Remove any existing event listeners to avoid conflicts
        const newEditRoleInput = editRoleInput.cloneNode(true);
        editRoleInput.parentNode.replaceChild(newEditRoleInput, editRoleInput);
        
        newEditRoleInput.addEventListener('click', function(e) {
          e.stopPropagation();
          editRoleDropdown.style.display = editRoleOpen ? 'none' : 'block';
          newEditRoleInput.style.borderColor = editRoleOpen ? '#e9ecef' : '#007bff';
          editRoleOpen = !editRoleOpen;
        });
        
        newEditRoleInput.addEventListener('focus', function() {
          this.style.borderColor = '#007bff';
        });
        
        newEditRoleInput.addEventListener('blur', function() {
          this.style.borderColor = '#e9ecef';
        });
        
        document.addEventListener('click', function() {
          editRoleDropdown.style.display = 'none';
          newEditRoleInput.style.borderColor = '#e9ecef';
          editRoleOpen = false;
        });
        
        // Role options - using inline onclick handlers from HTML instead of JavaScript event listeners
        // This avoids conflicts with the inline onclick="selectRole('Role Name')" handlers
        
        // Info textarea auto-resize functionality
        const editPersonInfoInput = document.getElementById('editPersonInfoInput');
        if (editPersonInfoInput) {
          editPersonInfoInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
          });
          
          // Initial resize
          editPersonInfoInput.style.height = 'auto';
          editPersonInfoInput.style.height = editPersonInfoInput.scrollHeight + 'px';
        }
        
        // Show in People Page checkbox functionality
        const editShowCheckbox = document.getElementById('editShowInPeopleCheckbox');
        let editShowChecked = true; // Default to true for existing person
        
        function renderEditShowCheckbox() {
          editShowCheckbox.innerHTML = editShowChecked ? 
            `<svg width="16" height="16" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill="#007bff"/><path d="M6 10.5l3 3 5-5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>` : '';
          editShowCheckbox.style.borderColor = editShowChecked ? '#007bff' : '#e9ecef';
          editShowCheckbox.style.background = editShowChecked ? '#007bff22' : '#fff';
        }
        
        editShowCheckbox.addEventListener('click', function() { 
          editShowChecked = !editShowChecked; 
          renderEditShowCheckbox(); 
        });
        
        editShowCheckbox.addEventListener('keydown', function(e) { 
          if(e.key === ' ' || e.key === 'Enter') { 
            editShowChecked = !editShowChecked; 
            renderEditShowCheckbox(); 
          }
        });
        
        renderEditShowCheckbox();
        
        // Social links functionality - use global functions
        const editSocialLinksContainer = document.getElementById('editSocialLinksContainer');
        const editAddSocialLinkBtn = document.getElementById('editAddSocialLinkBtn');
        
        // Initialize global editSocialLinks array if it doesn't exist
        if (typeof window.editSocialLinks === 'undefined') {
          window.editSocialLinks = [];
        }
        
        // Use global functions instead of local ones
        window.renderEditSocialLinks();
        
        // The button now uses inline onclick handler, so we don't need to add event listeners here
        // The global addEditSocialLink function will handle the click
        
        // Image upload functionality for edit modal - Simple approach first
        console.log('=== INITIALIZING EDIT MODAL IMAGE UPLOAD ===');
        
        // Get elements
        const editAvatarCircle = document.getElementById('editPersonAvatarCircle');
        const editAvatarIcon = document.getElementById('editPersonAvatarIcon');
        const editUploadBtn = document.getElementById('editUploadImageBtn');
        const editFileInput = document.getElementById('editPersonImageInput');
        const editCropModal = document.getElementById('editPersonCropModal');
        
        console.log('Edit modal elements found:', {
          editAvatarCircle: !!editAvatarCircle,
          editAvatarIcon: !!editAvatarIcon,
          editUploadBtn: !!editUploadBtn,
          editFileInput: !!editFileInput,
          editCropModal: !!editCropModal
        });
        
        let editAvatarImgData = null;
        let editCropper = null;
        
        // Simple direct approach - add inline onclick handler
        if (editUploadBtn) {
          console.log('Found edit upload button, adding inline handler');
          editUploadBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('=== EDIT UPLOAD BUTTON CLICKED ===');
            
            if (editFileInput) {
              console.log('Triggering file input click');
              editFileInput.click();
            } else {
              console.error('Edit file input not found');
            }
          };
        } else {
          console.error('Edit upload button not found');
        }
        
        // Add change event listener to file input
        if (editFileInput) {
          console.log('Found edit file input, adding change handler');
          editFileInput.onchange = function(e) {
            console.log('=== FILE INPUT CHANGE EVENT ===');
            const file = e.target.files[0];
            if (!file) {
              console.log('No file selected');
              return;
            }
            
            console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
            
            // Simple approach - just update the image directly without cropping first
            const reader = new FileReader();
            reader.onload = function(ev) {
              console.log('File loaded successfully');
              
              if (editAvatarIcon) {
                console.log('Updating avatar icon directly');
                editAvatarIcon.src = ev.target.result;
                editAvatarIcon.style.filter = 'none';
                editAvatarIcon.style.width = '100%';
                editAvatarIcon.style.height = '100%';
                editAvatarIcon.style.objectFit = 'cover';
                editAvatarIcon.style.borderRadius = '50%';
                console.log('Avatar updated successfully');
              } else {
                console.error('Edit avatar icon not found');
              }
            };
            
            reader.onerror = function() {
              console.error('Error reading file');
            };
            
            reader.readAsDataURL(file);
          };
        } else {
          console.error('Edit file input not found');
        }
      }
    })();
    // --- End Add New Person Card ---
    return;
  } else if (section.key === 'open-positions') {
    // --- Persistent vacancies using localStorage ---
    function getVacancies() {
      const saved = localStorage.getItem('vacancies');
      if (saved) return JSON.parse(saved);
      return [
        {
          position: 'Programmer',
          description: 'Knowledge of Python Scripting',
          status: 'Open',
          link: '',
          contactName: 'Dr. Saurabh Kumar',
          contactEmail: 'sirg.researchgroup@gmail.com',
          contactPhone: '7974899975',
          posted: 'February 26, 2025',
        },
      ];
    }
    function setVacancies(arr) {
      localStorage.setItem('vacancies', JSON.stringify(arr));
    }
    window.vacancies = getVacancies();
    // --- Helper: Render Vacancy Cards Grid ---
    function renderVacancyGrid() {
      const gridCols = 3;
      const cards = window.vacancies;
      let rows = [];
      for (let i = 0; i < cards.length; i += gridCols) {
        rows.push(cards.slice(i, i + gridCols));
      }
      let gridHTML = '';
      rows.forEach(row => {
        gridHTML += `<div class="vacancy-row" style="display: flex; flex-direction: row; gap: 2em; width: 900px; max-width: 98vw; margin: 2.5em auto 0 auto;">`;
        for (let c = 0; c < gridCols; ++c) {
          const card = row[c];
          if (card) {
            gridHTML += `<div class="vacancy-col" style="flex: 1 1 0; min-width: 0;">
              <div class="vacancy-card" data-idx="${window.vacancies.indexOf(card)}" style="position: relative; display: flex; flex-direction: column; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 2.2em 2em 2em 2em; width: 99%; max-width: 99%; text-align: left; box-sizing: border-box; min-height: 260px;">
                <div style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: flex-start;">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                    <span style="color: #1ca97c; font-weight: 700; font-size: 1.18rem;">${card.position}</span>
                    <span style="margin-left: auto; display: flex; align-items: center;">
                      <span style="background: ${card.status === 'Open' ? '#1ca97c' : '#888'}; color: #fff; font-size: 0.92rem; font-weight: 600; border-radius: 16px; padding: 0.18em 1.1em; margin-left: 1.5em; display: inline-block; vertical-align: middle; letter-spacing: 0.5px;">${card.status}</span>
                    </span>
                  </div>
                  <div style="margin-top: 0.5em; color: #222; font-size: 0.92rem; font-weight: 400;">${card.description}</div>
                  <div style="margin: 1.2em 0 1.2em 0; border-bottom: 1.5px solid #e5e5e5; width: 100%; opacity: 0.7;"></div>
                  <div style="color: #1ca97c; font-size: 1rem; font-weight: 600; margin-bottom: 0.5em;">Contact Person</div>
                  <div style="color: #222; font-size: 0.92rem; font-weight: 400; line-height: 1.6;">
                    ${card.contactName}<br>
                    ${card.contactEmail}<br>
                    ${card.contactPhone}<br>
                    <span style="color: #888; font-size: 0.92rem;">Posted on ${card.posted}</span>
                  </div>
                  <div style="margin-top: 1.2em; display: flex; justify-content: flex-end; gap: 0.7em; width: 100%;">
                    <button class="vacancy-card-edit-btn" style="background: #ffd600; color: #222; font-weight: 600; border: none; border-radius: 8px; padding: 0.5em 1.3em; font-size: 0.92rem; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">Edit</button>
                    <button class="vacancy-card-delete-btn" style="background: #ff3b3b; color: #fff; font-weight: 600; border: none; border-radius: 8px; padding: 0.5em 1.3em; font-size: 0.92rem; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">Delete</button>
                  </div>
                </div>
              </div>
            </div>`;
          } else {
            gridHTML += `<div style="flex: 1 1 0; min-width: 0;"></div>`;
          }
        }
        gridHTML += `</div>`;
      });
      return gridHTML;
    }
    // ... existing code ...
    table.style.background = '#f5f5f5';
    const openPositionsSection = document.getElementById('open-positionsSection');
    if (openPositionsSection) {
      openPositionsSection.style.background = '#f5f5f5';
      openPositionsSection.style.minHeight = '100vh';
    }
    // --- Render Main UI ---
    function renderOpenPositionsUI() {
      table.innerHTML = `
        <tbody><tr><td style="padding: 48px 0 0 0; text-align: center; border: none;">
          <div style="font-weight: bold; color: #111; font-size: 2.2rem; margin-bottom: 0.5em; text-align: center;">Manage Vacancies</div>
          <div style="height: 2em;"></div>
          <!-- Add New Vacancy Card -->
          <div id="addVacancyCard" style="display: flex; flex-direction: column; align-items: flex-start; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 2.2em 2em 2em 2em; width: 900px; max-width: 98vw; margin: 0 auto; text-align: left; box-sizing: border-box; min-height: 400px;">
            <div style="font-weight: bold; color: #111; font-size: 1.5rem; margin-bottom: 1.5rem;">Add New Vacancy</div>
            <!-- Labels Row -->
            <div style="display: flex; flex-direction: row; width: 100%; gap: 2em; margin-bottom: 0.3em;">
              <div style="flex: 1;"><label for="positionInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Position</label></div>
              <div style="flex: 1;"><label for="descriptionInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Description</label></div>
            </div>
            <!-- Inputs Row -->
            <div style="display: flex; flex-direction: row; width: 100%; gap: 2em;">
              <div style="flex: 1;"><input id="positionInput" type="text" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" /></div>
              <div style="flex: 1;"><textarea id="descriptionInput" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; resize: none; overflow: hidden; box-sizing: border-box; line-height: 1.4;"></textarea></div>
            </div>
            <!-- Status Row -->
            <div style="display: flex; flex-direction: row; width: 100%; gap: 2em; margin-top: 1.2em;">
              <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em; position: relative;">
                <label for="statusInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Status</label>
                <div id="statusInput" tabindex="0" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; display: flex; align-items: center; cursor: pointer; position: relative; box-sizing: border-box;">
                  <span id="statusSelected">Select Status</span>
                  <span style="margin-left: auto; color: #888; font-size: 1.2em; display: flex; align-items: center;"><svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round"/></svg></span>
                </div>
                <div id="statusDropdown" style="display: none; position: absolute; left: 0; top: 100%; z-index: 10; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.13); margin-top: 0.3em; min-width: 100%; overflow: hidden;">
                  <div class="status-option" data-status="Open" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">Open</div>
                  <div class="status-option" data-status="Closed" style="padding: 0.7em 1.2em; font-size: 1rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;">Closed</div>
                </div>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em;">
                <label for="linkInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Link (Optional)</label>
                <input id="linkInput" type="text" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" />
              </div>
            </div>
            <!-- Contact Name Row -->
            <div style="display: flex; flex-direction: row; width: 100%; gap: 2em; margin-top: 1.2em;">
              <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em;">
                <label for="contactNameInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Contact Name</label>
                <input id="contactNameInput" type="text" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em;">
                <label for="contactEmailInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Contact Email</label>
                <input id="contactEmailInput" type="email" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" />
              </div>
            </div>
            <!-- Contact Phone Row -->
            <div style="display: flex; flex-direction: row; width: 100%; gap: 2em; margin-top: 1.2em;">
              <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.3em;">
                <label for="contactPhoneInput" style="font-size: 0.92rem; color: #444; width: 100%; text-align: left;">Contact Phone</label>
                <input id="contactPhoneInput" type="tel" style="width: 100%; height: 36px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" />
              </div>
              <div style="flex: 1;"></div>
            </div>
            <!-- Add Vacancy Button Row -->
            <div style="display: flex; flex-direction: row; width: 100%; gap: 2em; margin-top: 1.5em;">
              <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start;">
                <button id="addVacancyBtn" type="button" style="background: #007bff; color: #fff; border: none; border-radius: 7px; padding: 0.8em 1.5em; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5em; transition: background 0.2s;"><span style="font-size: 1.2em;">+</span> Add Vacancy</button>
              </div>
              <div style="flex: 1;"></div>
            </div>
          </div>
          <!-- Vacancy Cards Grid -->
          <div id="vacancyCardsGrid"></div>
        </td></tr></tbody>
      `;
      // Render grid
      document.getElementById('vacancyCardsGrid').innerHTML = renderVacancyGrid();
      // Attach events for Add Vacancy, Edit, Delete, Modal
      setTimeout(() => {
        // Add Vacancy
        const addBtn = document.getElementById('addVacancyBtn');
        // --- Status Dropdown Logic ---
        const statusInput = document.getElementById('statusInput');
        const statusDropdown = document.getElementById('statusDropdown');
        const statusSelected = document.getElementById('statusSelected');
        let statusOpen = false;
        if (statusInput && statusDropdown && statusSelected) {
          statusInput.addEventListener('click', function(e) {
            e.stopPropagation();
            statusDropdown.style.display = statusOpen ? 'none' : 'block';
            statusInput.style.borderColor = statusOpen ? '#e9ecef' : '#007bff';
            statusOpen = !statusOpen;
          });
          statusInput.addEventListener('focus', function() {
            this.style.borderColor = '#007bff';
          });
          statusInput.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
          });
          document.addEventListener('click', function docStatusClose() {
            statusDropdown.style.display = 'none';
            statusInput.style.borderColor = '#e9ecef';
            statusOpen = false;
            document.removeEventListener('click', docStatusClose);
          });
          Array.from(statusDropdown.getElementsByClassName('status-option')).forEach(option => {
            option.addEventListener('mouseenter', function() {
              this.style.background = '#e6f0ff';
            });
            option.addEventListener('mouseleave', function() {
              this.style.background = '#fff';
            });
            option.addEventListener('click', function(e) {
              e.stopPropagation();
              statusSelected.textContent = this.getAttribute('data-status');
              statusDropdown.style.display = 'none';
              statusInput.style.borderColor = '#e9ecef';
              statusOpen = false;
            });
          });
        }
        addBtn.onclick = function() {
          const position = document.getElementById('positionInput').value.trim();
          const description = document.getElementById('descriptionInput').value.trim();
          const status = document.getElementById('statusSelected').textContent.trim();
          const link = document.getElementById('linkInput').value.trim();
          const contactName = document.getElementById('contactNameInput').value.trim();
          const contactEmail = document.getElementById('contactEmailInput').value.trim();
          const contactPhone = document.getElementById('contactPhoneInput').value.trim();
          if (!position || !description || (status !== 'Open' && status !== 'Closed') || !contactName || !contactEmail || !contactPhone) {
            addBtn.style.background = '#ff3b3b';
            setTimeout(() => { addBtn.style.background = '#007bff'; }, 800);
            return;
          }
          window.vacancies.push({
            position, description, status, link, contactName, contactEmail, contactPhone,
            posted: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          });
          setVacancies(window.vacancies);
          renderOpenPositionsUI();
        };
        // Edit/Delete/Modal for all cards
        document.querySelectorAll('.vacancy-card-edit-btn').forEach((editBtn, idx) => {
          editBtn.onclick = function() {
            const cardIdx = parseInt(editBtn.closest('.vacancy-card').getAttribute('data-idx'));
            const card = window.vacancies[cardIdx];
            const modal = document.getElementById('editVacancyModal');
            modal.style.display = 'flex';
            document.getElementById('editPositionInput').value = card.position;
            document.getElementById('editDescriptionInput').value = card.description;
            document.getElementById('editStatusSelected').textContent = card.status;
            document.getElementById('editLinkInput').value = card.link;
            document.getElementById('editContactNameInput').value = card.contactName;
            document.getElementById('editContactEmailInput').value = card.contactEmail;
            document.getElementById('editContactPhoneInput').value = card.contactPhone;
            // Save index for update
            modal.setAttribute('data-edit-idx', cardIdx);
          };
        });
        document.querySelectorAll('.vacancy-card-delete-btn').forEach((deleteBtn, idx) => {
          deleteBtn.onclick = function() {
            const cardIdx = parseInt(deleteBtn.closest('.vacancy-card').getAttribute('data-idx'));
            window.vacancies.splice(cardIdx, 1);
            setVacancies(window.vacancies);
            renderOpenPositionsUI();
          };
        });
        // Modal update
        const modal = document.getElementById('editVacancyModal');
        if (modal) {
          const updateBtn = document.getElementById('editVacancyUpdateBtn');
          const cancelBtn = document.getElementById('editVacancyCancelBtn');
          updateBtn.onclick = function(e) {
            e.preventDefault();
            const idx = parseInt(modal.getAttribute('data-edit-idx'));
            if (isNaN(idx)) return;
            const position = document.getElementById('editPositionInput').value.trim();
            const description = document.getElementById('editDescriptionInput').value.trim();
            const status = document.getElementById('editStatusSelected').textContent.trim();
            const link = document.getElementById('editLinkInput').value.trim();
            const contactName = document.getElementById('editContactNameInput').value.trim();
            const contactEmail = document.getElementById('editContactEmailInput').value.trim();
            const contactPhone = document.getElementById('editContactPhoneInput').value.trim();
            if (!position || !description || (status !== 'Open' && status !== 'Closed') || !contactName || !contactEmail || !contactPhone) {
              updateBtn.style.background = '#ff3b3b';
              setTimeout(() => { updateBtn.style.background = '#007bff'; }, 800);
              return;
            }
            window.vacancies[idx] = { ...window.vacancies[idx], position, description, status, link, contactName, contactEmail, contactPhone };
            setVacancies(window.vacancies);
            renderOpenPositionsUI();
            modal.style.display = 'none';
          };
          cancelBtn.onclick = function(e) {
            e.preventDefault();
            modal.style.display = 'none';
          };
        }
      }, 0);
    }
    renderOpenPositionsUI();
    return;
  } else {
    table.style.background = ''; // reset for other tables
    // For all sections except about and projects, clear the table (no placeholder, no data)
    table.innerHTML = '';
  }
}

// --- Check authentication on page load ---
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form
    initializeLoginForm();
    
    // Check authentication status
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    } else {
        showLoginForm();
    }
});

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    showLoginForm();
}

async function updateOverview(overview, token) {
  const response = await fetch('/api/about', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ overview })
  });
  if (!response.ok) {
    throw new Error('Failed to update.');
  }
  return await response.json();
}

// === PROJECTS API INTEGRATION (Non-intrusive) ===

// Fetch all projects from backend
async function fetchProjectsFromAPI() {
  const token = localStorage.getItem('adminToken');
  const res = await fetch('/api/projects', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return await res.json();
}

// Add a new project
async function addProjectToAPI(project) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Failed to add project');
  return await res.json();
}

// Update a project
async function updateProjectInAPI(id, project) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return await res.json();
}

// Delete a project
async function deleteProjectFromAPI(id) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

// === USAGE EXAMPLES (call these from your UI events) ===

// To fetch and display projects:
async function refreshProjectsFromAPI() {
  try {
    const projects = await fetchProjectsFromAPI();
    // You can now use 'projects' to render your UI
    // Example: renderProjectsSection(projects);
    console.log('Fetched projects from API:', projects);
  } catch (e) {
    console.error(e);
  }
}

// To add a project:
async function handleAddProjectAPI(newProject) {
  try {
    await addProjectToAPI(newProject);
    await refreshProjectsFromAPI();
  } catch (e) {
    console.error(e);
  }
}

// To update a project:
async function handleEditProjectAPI(id, updatedProject) {
  try {
    await updateProjectInAPI(id, updatedProject);
    await refreshProjectsFromAPI();
  } catch (e) {
    console.error(e);
  }
}

// To delete a project:
async function handleDeleteProjectAPI(id) {
  try {
    await deleteProjectFromAPI(id);
    await refreshProjectsFromAPI();
  } catch (e) {
    console.error(e);
  }
}

// ... existing code ...
// Add Edit Vacancy Modal HTML to the page (hidden by default)
if (!document.getElementById('editVacancyModal')) {
  const modal = document.createElement('div');
  modal.id = 'editVacancyModal';
  modal.style = `
    display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.18); align-items: center; justify-content: center;`;
  modal.innerHTML = `
    <div style="background: #fff; border-radius: 16px; box-shadow: 0 4px 32px rgba(0,0,0,0.13); padding: 2.5em 2.5em 2em 2.5em; min-width: 420px; min-height: 100px; max-width: 98vw; width: 420px; display: flex; flex-direction: column; align-items: center; position: relative; max-height: 90vh; overflow-y: auto;">
      <div style='font-size: 1.35rem; font-weight: 700; margin-bottom: 2.2em; text-align: center;'>Edit Vacancy</div>
      <form id='editVacancyForm' style='width: 100%; display: flex; flex-direction: column; gap: 1.1em;'>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Position</label><br>
          <input id='editPositionInput' type='text' style='width: 100%; height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;' />
        </div>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Description</label><br>
          <textarea id='editDescriptionInput' style='width: 100%; min-height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; resize: none; overflow: hidden; box-sizing: border-box; line-height: 1.4;'></textarea>
        </div>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Status</label><br>
          <div id='editStatusInput' tabindex='0' style='width: 100%; height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; display: flex; align-items: center; cursor: pointer; position: relative; box-sizing: border-box;'>
            <span id='editStatusSelected'>Select Status</span>
            <span style='margin-left: auto; color: #888; font-size: 1.2em; display: flex; align-items: center;'>
              <svg width='18' height='18' viewBox='0 0 20 20'><path d='M5 8l5 5 5-5' stroke='#888' stroke-width='2' fill='none' stroke-linecap='round'/></svg>
            </span>
            <div id='editStatusDropdown' style='display: none; position: absolute; left: 0; top: 100%; z-index: 1001; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.13); margin-top: 0.3em; min-width: 100%; overflow: hidden;'>
              <div class='edit-status-option' data-status='Open' style='padding: 0.7em 1.2em; font-size: 0.95rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;'>Open</div>
              <div class='edit-status-option' data-status='Closed' style='padding: 0.7em 1.2em; font-size: 0.95rem; color: #222; cursor: pointer; transition: background 0.2s; text-align: left;'>Closed</div>
            </div>
          </div>
        </div>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Link (Optional)</label><br>
          <input id='editLinkInput' type='text' style='width: 100%; height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;' />
        </div>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Contact Name</label><br>
          <input id='editContactNameInput' type='text' style='width: 100%; height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;' />
        </div>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Contact Email</label><br>
          <input id='editContactEmailInput' type='email' style='width: 100%; height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;' />
        </div>
        <div>
          <label style='font-size: 0.95rem; color: #444;'>Contact Phone</label><br>
          <input id='editContactPhoneInput' type='tel' style='width: 100%; height: 36px; font-size: 0.95rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;' />
        </div>
        <div style='display: flex; justify-content: flex-end; gap: 1em; margin-top: 1.5em;'>
          <button id='editVacancyUpdateBtn' type='submit' style='background: #007bff; color: #fff; font-weight: 600; border: none; border-radius: 8px; padding: 0.5em 2.2em; font-size: 1rem; cursor: pointer;'>Update</button>
          <button id='editVacancyCancelBtn' type='button' style='background: #e0e0e0; color: #222; font-weight: 600; border: none; border-radius: 8px; padding: 0.5em 2.2em; font-size: 1rem; cursor: pointer;'>Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

// Add Edit button logic for the vacancy card
const editBtn = document.querySelector('.vacancy-card-edit-btn');
if (editBtn) {
  editBtn.onclick = function() {
    const modal = document.getElementById('editVacancyModal');
    modal.style.display = 'flex';
    // Pre-fill values from the main card, not hardcoded
    const card = editBtn.closest('div[style*="background: #fff;"]');
    document.getElementById('editPositionInput').value = card.querySelector('span[style*="font-size: 1.18rem"]')?.textContent || '';
    document.getElementById('editDescriptionInput').value = card.querySelector('div[style*="margin-top: 0.5em;"]')?.textContent || '';
    document.getElementById('editStatusSelected').textContent = card.querySelector('span[style*="background: #1ca97c;"]')?.textContent || 'Select Status';
    document.getElementById('editLinkInput').value = '';
    const contactInfo = card.querySelector('div[style*="color: #1ca97c;"][style*="font-weight: 600;"]').nextElementSibling;
    if (contactInfo) {
      const lines = contactInfo.innerHTML.split('<br>');
      document.getElementById('editContactNameInput').value = (lines[0] || '').replace(/<[^>]+>/g, '').trim();
      document.getElementById('editContactEmailInput').value = (lines[1] || '').replace(/<[^>]+>/g, '').trim();
      document.getElementById('editContactPhoneInput').value = (lines[2] || '').replace(/<[^>]+>/g, '').trim();
    } else {
      document.getElementById('editContactNameInput').value = '';
      document.getElementById('editContactEmailInput').value = '';
      document.getElementById('editContactPhoneInput').value = '';
    }
  };
}
// Modal interactivity
(function() {
  const modal = document.getElementById('editVacancyModal');
  if (!modal) return;
  // Focus/blur for all inputs
  ['editPositionInput','editLinkInput','editContactNameInput','editContactEmailInput','editContactPhoneInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('focus', function() { this.style.borderColor = '#007bff'; });
      el.addEventListener('blur', function() { this.style.borderColor = '#e9ecef'; });
    }
  });
  // Description auto-resize and focus/blur
  const desc = document.getElementById('editDescriptionInput');
  if (desc) {
    desc.addEventListener('focus', function() { this.style.borderColor = '#007bff'; });
    desc.addEventListener('blur', function() { this.style.borderColor = '#e9ecef'; });
    function autoResize() {
      this.style.height = 'auto';
      this.style.height = Math.max(36, this.scrollHeight) + 'px';
    }
    desc.addEventListener('input', autoResize);
    desc.addEventListener('keydown', autoResize);
  }
  // Status dropdown logic
  const statusInput = document.getElementById('editStatusInput');
  const statusDropdown = document.getElementById('editStatusDropdown');
  const statusSelected = document.getElementById('editStatusSelected');
  let statusOpen = false;
  if (statusInput) {
    statusInput.addEventListener('click', function(e) {
      e.stopPropagation();
      statusDropdown.style.display = statusOpen ? 'none' : 'block';
      statusInput.style.borderColor = statusOpen ? '#e9ecef' : '#007bff';
      statusOpen = !statusOpen;
    });
    statusInput.addEventListener('focus', function() { this.style.borderColor = '#007bff'; });
    statusInput.addEventListener('blur', function() { this.style.borderColor = '#e9ecef'; });
    document.addEventListener('click', function() {
      statusDropdown.style.display = 'none';
      statusInput.style.borderColor = '#e9ecef';
      statusOpen = false;
    });
    Array.from(statusDropdown.getElementsByClassName('edit-status-option')).forEach(option => {
      option.addEventListener('mouseenter', function() { this.style.background = '#e6f0ff'; });
      option.addEventListener('mouseleave', function() { this.style.background = '#fff'; });
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        statusSelected.textContent = this.getAttribute('data-status');
        statusDropdown.style.display = 'none';
        statusInput.style.borderColor = '#e9ecef';
        statusOpen = false;
      });
    });
  }
  // Cancel button
  const cancelBtn = document.getElementById('editVacancyCancelBtn');
  if (cancelBtn) {
    cancelBtn.onclick = function(e) {
      e.preventDefault();
      modal.style.display = 'none';
    };
  }
  // Update button
  const form = document.getElementById('editVacancyForm');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      // Get new values
      const newPosition = document.getElementById('editPositionInput').value;
      const newDescription = document.getElementById('editDescriptionInput').value;
      const newStatus = document.getElementById('editStatusSelected').textContent;
      const newLink = document.getElementById('editLinkInput').value;
      const newContactName = document.getElementById('editContactNameInput').value;
      const newContactEmail = document.getElementById('editContactEmailInput').value;
      const newContactPhone = document.getElementById('editContactPhoneInput').value;
      // Update the main card with new values
      document.querySelector('span[style*="font-size: 1.18rem"]').textContent = newPosition;
      document.querySelector('div[style*="margin-top: 0.5em;"]').textContent = newDescription;
      document.getElementById('editStatusSelected').textContent = newStatus;
      document.querySelector('span[style*="background: #1ca97c;"]').textContent = newStatus;
      document.querySelector('div[style*="color: #1ca97c;"][style*="font-weight: 600;"]').nextElementSibling.innerHTML =
        newContactName + '<br>' +
        newContactEmail + '<br>' +
        newContactPhone + '<br>' +
        '<span style="color: #888; font-size: 0.92rem;">Posted on February 26, 2025</span>';
      // Also update the modal's input values to reflect the latest
      document.getElementById('editPositionInput').value = newPosition;
      document.getElementById('editDescriptionInput').value = newDescription;
      document.getElementById('editStatusSelected').textContent = newStatus;
      document.getElementById('editLinkInput').value = newLink;
      document.getElementById('editContactNameInput').value = newContactName;
      document.getElementById('editContactEmailInput').value = newContactEmail;
      document.getElementById('editContactPhoneInput').value = newContactPhone;
      // Close the modal
      modal.style.display = 'none';
    };
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  const calendarIcon = document.getElementById('calendarIcon');
  const calendarPopup = document.getElementById('calendarTimePopup');
  const courseTimeInput = document.getElementById('courseTimeInput');
  if (calendarIcon && calendarPopup) {
    calendarIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      if (calendarPopup.style.display === 'none' || !calendarPopup.style.display) {
        calendarPopup.style.display = 'flex';
        renderCalendarTimePicker();
      } else {
        calendarPopup.style.display = 'none';
      }
    });
    // Also open calendar when clicking the input box
    if (courseTimeInput) {
      courseTimeInput.addEventListener('click', function(e) {
        e.stopPropagation();
        if (calendarPopup.style.display === 'none' || !calendarPopup.style.display) {
          calendarPopup.style.display = 'flex';
          renderCalendarTimePicker();
        } else {
          calendarPopup.style.display = 'none';
        }
      });
    }
    // Hide popup when clicking outside
    document.addEventListener('click', function(event) {
      // Don't close if clicking on calendar navigation elements
      const isCalendarNavigation = event.target.closest('#calendarUpArrow') || 
                                   event.target.closest('#calendarDownArrow') || 
                                   event.target.closest('#yearDropdownArrow') ||
                                   event.target.closest('#yearSelectionPopup') ||
                                   event.target.closest('#yearList') ||
                                   event.target.closest('[onclick*="selectDate"]') ||
                                   event.target.closest('[onclick*="selectHour"]') ||
                                   event.target.closest('[onclick*="selectMinute"]') ||
                                   event.target.closest('[onclick*="selectYear"]') ||
                                   event.target.closest('#setTimeBtn');
      
      if (!calendarPopup.contains(event.target) && event.target !== calendarIcon && event.target !== courseTimeInput && !isCalendarNavigation) {
        calendarPopup.style.display = 'none';
      }
    });
  }
});

// Global variables for calendar state
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let selectedHour = null;
let selectedMinute = null;

function renderCalendarTimePicker() {
  const popup = document.getElementById('calendarTimePopup');
  if (!popup) return;

  // Helper to get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar header with year dropdown
  const calendarHeader = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5em;">
      <div style="display: flex; align-items: center; gap: 0.5em;">
        <div style="font-weight: 600; font-size: 1.1em;">${monthNames[currentMonth]} ${currentYear}</div>
        <span id="yearDropdownArrow" style="cursor:pointer; padding: 0.2em; border-radius: 3px;">
          <svg width="14" height="14" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </span>
      </div>
      <div style="display: flex; gap: 0.5em;">
        <span id="calendarUpArrow" style="cursor:pointer; padding: 0.2em; border-radius: 3px; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 12l5-5 5 5" stroke="#007bff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </span>
        <span id="calendarDownArrow" style="cursor:pointer; padding: 0.2em; border-radius: 3px; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#007bff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </span>
      </div>
    </div>
  `;

  // Year selection popup (hidden by default)
  const yearSelectionPopup = `
    <div id="yearSelectionPopup" style="display: none; position: absolute; top: -10px; left: -10px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 1em; min-width: 200px; max-height: 300px; overflow-y: auto; z-index: 20;">
      <div style="font-weight: 600; margin-bottom: 0.5em; color: #333;">Select Year</div>
      <div id="yearList" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.3em;">
        <!-- Years will be populated by JavaScript -->
      </div>
    </div>
  `;

  // Calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let calendarGrid = '<div style="display: grid; grid-template-columns: repeat(7, 2em); gap: 0.2em;">';
  
  // Weekday headers
  const weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  for (let d = 0; d < 7; d++) {
    calendarGrid += `<div style='font-weight:600; text-align:center; color:#007bff; font-size: 0.8em;'>${weekdays[d]}</div>`;
  }
  
  // Empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    calendarGrid += '<div></div>';
  }
  
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
    const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
    
    let dayStyle = 'text-align:center; padding:0.3em 0; border-radius:5px; cursor:pointer; font-size: 0.9em; transition: all 0.2s;';
    if (isSelected) {
      dayStyle += 'background:#007bff; color:#fff;';
    } else if (isToday) {
      dayStyle += 'background:#e6f0ff; color:#007bff; font-weight:600;';
    }
    
    calendarGrid += `<div style="${dayStyle}" onclick="event.stopPropagation(); selectDate(${d})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${d}</div>`;
  }
  calendarGrid += '</div>';

  // Time picker
  let hourList = '<div style="height: 120px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5em; width: 3em;">';
  for (let h = 1; h <= 24; h++) {
    const isSelected = selectedHour === h;
    let hourStyle = 'padding:0.2em 0; text-align:center; cursor:pointer; font-size: 0.8em; transition: background 0.2s;';
    if (isSelected) {
      hourStyle += 'background:#007bff; color:#fff;';
    }
    hourList += `<div style="${hourStyle}" onclick="event.stopPropagation(); selectHour(${h})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${h.toString().padStart(2,'0')}</div>`;
  }
  hourList += '</div>';
  
  let minuteList = '<div style="height: 120px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; width: 3em;">';
  for (let m = 0; m < 60; m++) {
    const isSelected = selectedMinute === m;
    let minuteStyle = 'padding:0.2em 0; text-align:center; cursor:pointer; font-size: 0.8em; transition: background 0.2s;';
    if (isSelected) {
      minuteStyle += 'background:#007bff; color:#fff;';
    }
    minuteList += `<div style="${minuteStyle}" onclick="event.stopPropagation(); selectMinute(${m})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${m.toString().padStart(2,'0')}</div>`;
  }
  minuteList += '</div>';

  // Layout: calendar left, time right
  popup.innerHTML = `
    <div style="position: relative;">
      ${yearSelectionPopup}
      <div style="display: flex; flex-direction: row; gap: 1.5em;">
        <div style="min-width: 16em; position: relative;">
          ${calendarHeader}
          ${calendarGrid}
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin-top: 0.7em; gap: 0.5em;">
            <button id="clearCalendarBtn" style="background: #007bff; color: #fff; border: none; border-radius: 5px; padding: 0.35em 1.2em; font-size: 0.95em; cursor: pointer; font-weight: 600; transition: background 0.2s; min-height: 32px;">Clear</button>
            <button id="setTimeBtn" style="flex: 1; padding: 0.35em; background: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9em; transition: background 0.2s; min-height: 32px;" onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'" onclick="setSelectedDateTime()">Set Date & Time</button>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5em; justify-content: flex-start; width: 10em;">
          <div style="font-weight: 600; margin-bottom: 0.2em; font-size: 0.9em;">Hour</div>
          ${hourList}
          <div style="font-weight: 600; margin: 0.5em 0 0.2em 0; font-size: 0.9em;">Minute</div>
          ${minuteList}
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  addCalendarEventListeners();
  populateYearList();
  // Add clear button event
  const clearBtn = document.getElementById('clearCalendarBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      selectedDate = null;
      selectedHour = null;
      selectedMinute = null;
      const timeInput = document.getElementById('courseTimeInput');
      if (timeInput) timeInput.value = '';
      renderCalendarTimePicker();
    });
  }
}

// Function to add event listeners for calendar navigation
function addCalendarEventListeners() {
  // Month navigation
  const upArrow = document.getElementById('calendarUpArrow');
  const downArrow = document.getElementById('calendarDownArrow');
  const yearDropdownArrow = document.getElementById('yearDropdownArrow');

  if (upArrow) {
    upArrow.addEventListener('click', function(e) {
      e.stopPropagation();
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendarTimePicker();
    });
  }

  if (downArrow) {
    downArrow.addEventListener('click', function(e) {
      e.stopPropagation();
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendarTimePicker();
    });
  }

  if (yearDropdownArrow) {
    yearDropdownArrow.addEventListener('click', function(e) {
      e.stopPropagation();
      const yearPopup = document.getElementById('yearSelectionPopup');
      if (yearPopup) {
        yearPopup.style.display = yearPopup.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Close year popup when clicking outside
  document.addEventListener('click', function(event) {
    const yearPopup = document.getElementById('yearSelectionPopup');
    const yearDropdownArrow = document.getElementById('yearDropdownArrow');
    // Don't close year popup if clicking on year selection elements
    const isYearSelection = event.target.closest('#yearList') || 
                           event.target.closest('[onclick*="selectYear"]');
    
    if (yearPopup && !yearPopup.contains(event.target) && event.target !== yearDropdownArrow && !isYearSelection) {
      yearPopup.style.display = 'none';
    }
  });
}

// Function to populate year list
function populateYearList() {
  const yearList = document.getElementById('yearList');
  if (!yearList) return;

  const currentYear = new Date().getFullYear();
  let yearListHTML = '';

  // Show years from 2000 to current year + 10
  for (let year = 2000; year <= currentYear + 10; year++) {
    const isSelectedYear = year === currentYear;
    let yearStyle = 'padding: 0.3em 0.5em; text-align: center; cursor: pointer; border-radius: 3px; font-size: 0.9em; transition: background 0.2s;';
    if (isSelectedYear) {
      yearStyle += 'background: #007bff; color: #fff;';
    }
    yearListHTML += `<div style="${yearStyle}" onclick="event.stopPropagation(); selectYear(${year})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${year}</div>`;
  }

  yearList.innerHTML = yearListHTML;
}

// Function to select a year
function selectYear(year) {
  currentYear = year;
  const yearPopup = document.getElementById('yearSelectionPopup');
  if (yearPopup) {
    yearPopup.style.display = 'none';
  }
  renderCalendarTimePicker();
}

// Function to select a date
function selectDate(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  renderCalendarTimePicker();
}

// Function to select hour
function selectHour(hour) {
  selectedHour = hour;
  renderCalendarTimePicker();
}

// Function to select minute
function selectMinute(minute) {
  selectedMinute = minute;
  renderCalendarTimePicker();
}

// Function to set the selected date and time
function setSelectedDateTime() {
  if (selectedDate && selectedHour !== null && selectedMinute !== null) {
    const timeInput = document.getElementById('courseTimeInput');
    if (timeInput) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const hour = selectedHour.toString().padStart(2, '0');
      const minute = selectedMinute.toString().padStart(2, '0');
      timeInput.value = `${day}-${month}-${year} ${hour}:${minute}`;
    }
    // Close the calendar popup after a short delay to show the selection
    setTimeout(() => {
      const calendarPopup = document.getElementById('calendarTimePopup');
      if (calendarPopup) {
        calendarPopup.style.display = 'none';
      }
    }, 300);
  } else {
    // Show a brief message if not all selections are made
    const setTimeBtn = document.getElementById('setTimeBtn');
    if (setTimeBtn) {
      const originalText = setTimeBtn.textContent;
      setTimeBtn.textContent = 'Please select date & time';
      setTimeBtn.style.background = '#dc3545';
      setTimeout(() => {
        setTimeBtn.textContent = originalText;
        setTimeBtn.style.background = '#007bff';
      }, 2000);
    }
  }
}

// Patch: render calendar/time picker when popup is opened
(function patchCalendarPopup() {
  const calendarIcon = document.getElementById('calendarIcon');
  const calendarPopup = document.getElementById('calendarTimePopup');
  if (calendarIcon && calendarPopup) {
    calendarIcon.addEventListener('click', function() {
      renderCalendarTimePicker();
    });
  }
})();

// Function to delete a course card by id
function deleteCourseCard(id) {
  var card = document.getElementById(id);
  if (card) card.remove();
}

// Edit Course Modal logic
function openEditCourseModal() {
  document.getElementById('editCourseModal').style.display = 'block';
  document.getElementById('editCourseOverlay').style.display = 'block';
}
function closeEditCourseModal() {
  document.getElementById('editCourseModal').style.display = 'none';
  document.getElementById('editCourseOverlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  var cancelBtn = document.getElementById('editCourseCancelBtn');
  if (cancelBtn) {
    cancelBtn.onclick = closeEditCourseModal;
  }
  var overlay = document.getElementById('editCourseOverlay');
  if (overlay) {
    overlay.onclick = closeEditCourseModal;
  }
  // Calendar popup for edit modal
  var editCalendarIcon = document.getElementById('editCalendarIcon');
  var editCalendarPopup = document.getElementById('editCalendarTimePopup');
  var editCourseTimeInput = document.getElementById('editCourseTimeInput');
  if (editCalendarIcon && editCalendarPopup) {
    editCalendarIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      if (editCalendarPopup.style.display === 'none' || !editCalendarPopup.style.display) {
        editCalendarPopup.style.display = 'flex';
        renderEditCalendarTimePicker();
      } else {
        editCalendarPopup.style.display = 'none';
      }
    });
    if (editCourseTimeInput) {
      editCourseTimeInput.addEventListener('click', function(e) {
        e.stopPropagation();
        if (editCalendarPopup.style.display === 'none' || !editCalendarPopup.style.display) {
          editCalendarPopup.style.display = 'flex';
          renderEditCalendarTimePicker();
        } else {
          editCalendarPopup.style.display = 'none';
        }
      });
    }
    document.addEventListener('click', function(event) {
      if (!editCalendarPopup.contains(event.target) && event.target !== editCalendarIcon && event.target !== editCourseTimeInput) {
        editCalendarPopup.style.display = 'none';
      }
    });
  }
});
// Dummy function for rendering the edit calendar (reuse your main calendar logic or copy as needed)
function renderEditCalendarTimePicker() {
  // You can copy the renderCalendarTimePicker logic here, but use editCalendarTimePopup and editCourseTimeInput instead
  // For brevity, this is left as a placeholder
  document.getElementById('editCalendarTimePopup').innerHTML = '<div style="padding:2em; color:#888;">(Calendar picker logic here)</div>';
}

// ... existing code ...

function renderEditCalendarTimePicker() {
  const popup = document.getElementById('editCalendarTimePopup');
  if (!popup) return;

  // Helper to get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar header with year dropdown
  const calendarHeader = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5em;">
      <div style="display: flex; align-items: center; gap: 0.5em;">
        <div style="font-weight: 600; font-size: 1.1em;">${monthNames[currentMonth]} ${currentYear}</div>
        <span id="editYearDropdownArrow" style="cursor:pointer; padding: 0.2em; border-radius: 3px;">
          <svg width="14" height="14" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </span>
      </div>
      <div style="display: flex; gap: 0.5em;">
        <span id="editCalendarUpArrow" style="cursor:pointer; padding: 0.2em; border-radius: 3px; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 12l5-5 5 5" stroke="#007bff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </span>
        <span id="editCalendarDownArrow" style="cursor:pointer; padding: 0.2em; border-radius: 3px; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#007bff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </span>
      </div>
    </div>
  `;

  // Year selection popup (hidden by default)
  const yearSelectionPopup = `
    <div id="editYearSelectionPopup" style="display: none; position: absolute; top: -10px; left: -10px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 1em; min-width: 200px; max-height: 300px; overflow-y: auto; z-index: 20;">
      <div style="font-weight: 600; margin-bottom: 0.5em; color: #333;">Select Year</div>
      <div id="editYearList" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.3em;">
        <!-- Years will be populated by JavaScript -->
      </div>
    </div>
  `;

  // Calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let calendarGrid = '<div style="display: grid; grid-template-columns: repeat(7, 2em); gap: 0.2em;">';
  
  // Weekday headers
  const weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  for (let d = 0; d < 7; d++) {
    calendarGrid += `<div style='font-weight:600; text-align:center; color:#007bff; font-size: 0.8em;'>${weekdays[d]}</div>`;
  }
  
  // Empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    calendarGrid += '<div></div>';
  }
  
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
    const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
    
    let dayStyle = 'text-align:center; padding:0.3em 0; border-radius:5px; cursor:pointer; font-size: 0.9em; transition: all 0.2s;';
    if (isSelected) {
      dayStyle += 'background:#007bff; color:#fff;';
    } else if (isToday) {
      dayStyle += 'background:#e6f0ff; color:#007bff; font-weight:600;';
    }
    
    calendarGrid += `<div style="${dayStyle}" onclick="event.stopPropagation(); selectEditDate(${d})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${d}</div>`;
  }
  calendarGrid += '</div>';

  // Time picker
  let hourList = '<div style="height: 120px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5em; width: 3em;">';
  for (let h = 1; h <= 24; h++) {
    const isSelected = selectedHour === h;
    let hourStyle = 'padding:0.2em 0; text-align:center; cursor:pointer; font-size: 0.8em; transition: background 0.2s;';
    if (isSelected) {
      hourStyle += 'background:#007bff; color:#fff;';
    }
    hourList += `<div style="${hourStyle}" onclick="event.stopPropagation(); selectEditHour(${h})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${h.toString().padStart(2,'0')}</div>`;
  }
  hourList += '</div>';
  
  let minuteList = '<div style="height: 120px; overflow-y: auto; border: 1px solid #e9ecef; border-radius: 6px; width: 3em;">';
  for (let m = 0; m < 60; m++) {
    const isSelected = selectedMinute === m;
    let minuteStyle = 'padding:0.2em 0; text-align:center; cursor:pointer; font-size: 0.8em; transition: background 0.2s;';
    if (isSelected) {
      minuteStyle += 'background:#007bff; color:#fff;';
    }
    minuteList += `<div style="${minuteStyle}" onclick="event.stopPropagation(); selectEditMinute(${m})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${m.toString().padStart(2,'0')}</div>`;
  }
  minuteList += '</div>';

  // Layout: calendar left, time right
  popup.innerHTML = `
    <div style="position: relative;">
      ${yearSelectionPopup}
      <div style="display: flex; flex-direction: row; gap: 1.5em;">
        <div style="min-width: 16em; position: relative;">
          ${calendarHeader}
          ${calendarGrid}
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin-top: 0.7em; gap: 0.5em;">
            <button id="editClearCalendarBtn" style="background: #007bff; color: #fff; border: none; border-radius: 5px; padding: 0.35em 1.2em; font-size: 0.95em; cursor: pointer; font-weight: 600; transition: background 0.2s; min-height: 32px;">Clear</button>
            <button id="editSetTimeBtn" style="flex: 1; padding: 0.35em; background: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9em; transition: background 0.2s; min-height: 32px;" onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">Set Date & Time</button>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5em; justify-content: flex-start; width: 10em;">
          <div style="font-weight: 600; margin-bottom: 0.2em; font-size: 0.9em;">Hour</div>
          ${hourList}
          <div style="font-weight: 600; margin: 0.5em 0 0.2em 0; font-size: 0.9em;">Minute</div>
          ${minuteList}
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  addEditCalendarEventListeners();
  populateEditYearList();
  // Add clear button event
  const clearBtn = document.getElementById('editClearCalendarBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      selectedDate = null;
      selectedHour = null;
      selectedMinute = null;
      const timeInput = document.getElementById('editCourseTimeInput');
      if (timeInput) timeInput.value = '';
      renderEditCalendarTimePicker();
    });
  }
  // Set Date & Time button
  const setTimeBtn = document.getElementById('editSetTimeBtn');
  if (setTimeBtn) {
    setTimeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      setEditSelectedDateTime();
    });
  }
}

// Add event listeners for edit calendar navigation
function addEditCalendarEventListeners() {
  // Month navigation
  const upArrow = document.getElementById('editCalendarUpArrow');
  const downArrow = document.getElementById('editCalendarDownArrow');
  const yearDropdownArrow = document.getElementById('editYearDropdownArrow');

  if (upArrow) {
    upArrow.addEventListener('click', function(e) {
      e.stopPropagation();
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderEditCalendarTimePicker();
    });
  }

  if (downArrow) {
    downArrow.addEventListener('click', function(e) {
      e.stopPropagation();
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderEditCalendarTimePicker();
    });
  }

  if (yearDropdownArrow) {
    yearDropdownArrow.addEventListener('click', function(e) {
      e.stopPropagation();
      const yearPopup = document.getElementById('editYearSelectionPopup');
      if (yearPopup) {
        yearPopup.style.display = yearPopup.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Close year popup when clicking outside
  document.addEventListener('click', function(event) {
    const yearPopup = document.getElementById('editYearSelectionPopup');
    const yearDropdownArrow = document.getElementById('editYearDropdownArrow');
    // Don't close year popup if clicking on year selection elements
    const isYearSelection = event.target.closest('#editYearList') || 
                           event.target.closest('[onclick*="selectEditYear"]');
    
    if (yearPopup && !yearPopup.contains(event.target) && event.target !== yearDropdownArrow && !isYearSelection) {
      yearPopup.style.display = 'none';
    }
  });
}

// Populate year list for edit calendar
function populateEditYearList() {
  const yearList = document.getElementById('editYearList');
  if (!yearList) return;
  const currentYearVal = new Date().getFullYear();
  let yearListHTML = '';
  for (let year = 2000; year <= currentYearVal + 10; year++) {
    const isSelectedYear = year === currentYear;
    let yearStyle = 'padding: 0.3em 0.5em; text-align: center; cursor: pointer; border-radius: 3px; font-size: 0.9em; transition: background 0.2s;';
    if (isSelectedYear) {
      yearStyle += 'background: #007bff; color: #fff;';
    }
    yearListHTML += `<div style="${yearStyle}" onclick="event.stopPropagation(); selectEditYear(${year})" onmouseover="if(!this.style.background.includes('#007bff')) this.style.background='#f0f0f0'" onmouseout="if(!this.style.background.includes('#007bff')) this.style.background='transparent'">${year}</div>`;
  }
  yearList.innerHTML = yearListHTML;
}

// Select year for edit calendar
function selectEditYear(year) {
  currentYear = year;
  const yearPopup = document.getElementById('editYearSelectionPopup');
  if (yearPopup) {
    yearPopup.style.display = 'none';
  }
  renderEditCalendarTimePicker();
}
// Select date for edit calendar
function selectEditDate(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  renderEditCalendarTimePicker();
}
// Select hour for edit calendar
function selectEditHour(hour) {
  selectedHour = hour;
  renderEditCalendarTimePicker();
}
// Select minute for edit calendar
function selectEditMinute(minute) {
  selectedMinute = minute;
  renderEditCalendarTimePicker();
}
// Set selected date and time for edit calendar
function setEditSelectedDateTime() {
  if (selectedDate && selectedHour !== null && selectedMinute !== null) {
    const timeInput = document.getElementById('editCourseTimeInput');
    if (timeInput) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const hour = selectedHour.toString().padStart(2, '0');
      const minute = selectedMinute.toString().padStart(2, '0');
      timeInput.value = `${day}-${month}-${year} ${hour}:${minute}`;
    }
    setTimeout(() => {
      const calendarPopup = document.getElementById('editCalendarTimePopup');
      if (calendarPopup) {
        calendarPopup.style.display = 'none';
      }
    }, 300);
  } else {
    const setTimeBtn = document.getElementById('editSetTimeBtn');
    if (setTimeBtn) {
      const originalText = setTimeBtn.textContent;
      setTimeBtn.textContent = 'Please select date & time';
      setTimeBtn.style.background = '#dc3545';
      setTimeout(() => {
        setTimeBtn.textContent = originalText;
        setTimeBtn.style.background = '#007bff';
      }, 2000);
    }
  }
}

// ... existing code ...
// Global variable to track the currently edited course card
let currentEditingCourseCardId = null;

// Helper to get course card data from DOM
function getCourseCardData(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return null;
  const spans = card.querySelectorAll('span');
  return {
    name: spans[0]?.textContent || '',
    code: spans[1]?.textContent || '',
    instructor: spans[2]?.textContent || '',
    semester: spans[3]?.textContent.replace('Semester ', '') || '',
    credits: spans[4]?.textContent.replace(' Credits', '') || '',
    type: spans[5]?.textContent || ''
  };
}

// Helper to set course card data in DOM
function setCourseCardData(cardId, data) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const spans = card.querySelectorAll('span');
  if (spans[0]) spans[0].textContent = data.name;
  if (spans[1]) spans[1].textContent = data.code;
  if (spans[2]) spans[2].textContent = data.instructor;
  if (spans[3]) spans[3].textContent = `Semester ${data.semester}`;
  if (spans[4]) spans[4].textContent = `${data.credits} Credits`;
  if (spans[5]) spans[5].textContent = data.type;
}

// Modified openEditCourseModal to accept cardId
function openEditCourseModal(cardId) {
  currentEditingCourseCardId = cardId;
  const data = getCourseCardData(cardId);
  if (data) {
    document.getElementById('editCourseName').value = data.name;
    document.getElementById('editCourseCode').value = data.code;
    document.getElementById('editCourseInstructor').value = data.instructor;
    document.getElementById('editSemesterInput').value = data.semester;
    document.getElementById('editCreditsInput').value = data.credits;
    document.getElementById('editCourseType').value = data.type;
    // Optionally, set course time if you store it in the card or elsewhere
    // document.getElementById('editCourseTimeInput').value = ...
  }
  document.getElementById('editCourseModal').style.display = 'block';
  document.getElementById('editCourseOverlay').style.display = 'block';
}

// Update button logic
const editUpdateBtn = document.getElementById('editCourseUpdateBtn');
if (editUpdateBtn) {
  editUpdateBtn.onclick = function() {
    if (!currentEditingCourseCardId) return;
    const updatedData = {
      name: document.getElementById('editCourseName').value,
      code: document.getElementById('editCourseCode').value,
      instructor: document.getElementById('editCourseInstructor').value,
      semester: document.getElementById('editSemesterInput').value,
      credits: document.getElementById('editCreditsInput').value,
      type: document.getElementById('editCourseType').value
      // Optionally, add time: document.getElementById('editCourseTimeInput').value
    };
    setCourseCardData(currentEditingCourseCardId, updatedData);
    closeEditCourseModal();
  };
}
// ... existing code ...

// ... existing code ...
// Utility to generate unique card IDs
let courseCardCounter = 2;

// Local Storage Key
const COURSE_CARDS_KEY = 'courseCards';

// Helper: Save all dynamic cards to localStorage
function saveCourseCardsToStorage(cards) {
  localStorage.setItem(COURSE_CARDS_KEY, JSON.stringify(cards));
}

// Helper: Load all dynamic cards from localStorage
function loadCourseCardsFromStorage() {
  const data = localStorage.getItem(COURSE_CARDS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper: Render a dynamic course card
function renderDynamicCourseCard(cardData) {
  const cardId = cardData.id;
  const card = document.createElement('div');
  card.id = cardId;
  card.style.background = '#fff';
  card.style.borderRadius = '12px';
  card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
  card.style.padding = '1.5em';
  card.style.display = 'flex';
  card.style.flexDirection = 'row';
  card.style.alignItems = 'center';
  card.style.minHeight = '210px';
  card.style.position = 'relative';
  card.style.width = '100%';
  card.style.maxWidth = '100%';
  card.style.boxSizing = 'border-box';
  card.innerHTML = `
    <div style="flex: 1; display: flex; flex-direction: column; gap: 0.2em; width: 100%; max-width: 100%; box-sizing: border-box;">
      <span style="color: #1ca97c; font-size: 1.25rem; font-weight: 700; white-space: normal; overflow-wrap: break-word; word-break: break-word; width: 100%; max-width: 100%; display: block;">${cardData.name}</span>
      <span style="color: #1ca97c; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.2em; overflow-wrap: break-word; word-break: break-word; width: 100%; max-width: 100%; display: block;">${cardData.code}</span>
      <span style="color: #111; font-size: 1.05rem; font-weight: 500; overflow-wrap: break-word; word-break: break-word; width: 100%; max-width: 100%; display: block;">${cardData.instructor}</span>
      <span style="color: #111; font-size: 1.05rem; font-weight: 500; overflow-wrap: break-word; word-break: break-word; width: 100%; max-width: 100%; display: block;">Semester ${cardData.semester}</span>
      <span style="color: #111; font-size: 1.05rem; font-weight: 500; overflow-wrap: break-word; word-break: break-word; width: 100%; max-width: 100%; display: block;">${cardData.credits} Credits</span>
      <span style="display: inline-block; background: #e6f9f0; color: #1ca97c; font-size: 1.05rem; font-weight: 600; border-radius: 16px; padding: 0.18em 1.1em; margin-top: 0.5em; overflow-wrap: break-word; word-break: break-word; width: 100%; max-width: 100%;">${cardData.type}</span>
      <div style="display: flex; flex-direction: row; justify-content: flex-end; gap: 0.7em; margin-top: 1.1em;">
        <button class="edit-course-btn" style="background: #ffc107; color: #111; border: none; border-radius: 6px; padding: 0.45em 1.2em; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;" data-cardid="${cardId}">Edit</button>
        <button class="delete-course-btn" style="background: #dc3545; color: #fff; border: none; border-radius: 6px; padding: 0.45em 1.2em; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;" data-cardid="${cardId}">Delete</button>
      </div>
    </div>
  `;
  // Bind Edit/Delete
  card.querySelector('.edit-course-btn').onclick = function() { openEditCourseModal(cardId); };
  card.querySelector('.delete-course-btn').onclick = function() { deleteCourseCard(cardId, true); };
  document.querySelector('.courses-grid').appendChild(card);
}

// On page load, render all cards from storage
window.addEventListener('DOMContentLoaded', function() {
  const cards = loadCourseCardsFromStorage();
  cards.forEach(cardData => {
    renderDynamicCourseCard(cardData);
    // Keep courseCardCounter ahead of max id
    const num = parseInt(cardData.id.replace('courseCard', ''));
    if (!isNaN(num) && num >= courseCardCounter) courseCardCounter = num + 1;
  });
});

// Add Course button logic
const addCourseBtn = document.getElementById('addCourseBtn');
if (addCourseBtn) {
  addCourseBtn.onclick = function() {
    // Get values from Add New Course card
    const addCardInputs = document.querySelectorAll('#addTeachingVacancyCard input[type="text"]');
    const name = addCardInputs[0]?.value || '';
    const code = addCardInputs[1]?.value || '';
    const type = addCardInputs[2]?.value || '';
    const time = document.getElementById('courseTimeInput')?.value || '';
    const instructor = document.getElementById('courseInstructorInput')?.value || '';
    const semester = document.getElementById('semesterInput')?.value || '';
    const credits = document.getElementById('creditsInput')?.value || '';
    // Validate at least name
    if (!name) return alert('Please enter a course name.');
    // Create new card data
    const cardId = `courseCard${courseCardCounter++}`;
    const cardData = { id: cardId, name, code, type, time, semester, credits, instructor };
    // Save to storage
    const cards = loadCourseCardsFromStorage();
    cards.push(cardData);
    saveCourseCardsToStorage(cards);
    // Render card
    renderDynamicCourseCard(cardData);
    // Clear inputs after adding
    if (addCardInputs[0]) addCardInputs[0].value = '';
    if (addCardInputs[1]) addCardInputs[1].value = '';
    if (addCardInputs[2]) addCardInputs[2].value = '';
    if (document.getElementById('courseTimeInput')) document.getElementById('courseTimeInput').value = '';
    if (document.getElementById('courseInstructorInput')) document.getElementById('courseInstructorInput').value = '';
    if (document.getElementById('semesterInput')) document.getElementById('semesterInput').value = '';
    if (document.getElementById('creditsInput')) document.getElementById('creditsInput').value = '';
  };
}

// Override deleteCourseCard to update storage
function deleteCourseCard(id, isDynamic) {
  var card = document.getElementById(id);
  if (card) card.remove();
  if (isDynamic) {
    let cards = loadCourseCardsFromStorage();
    cards = cards.filter(c => c.id !== id);
    saveCourseCardsToStorage(cards);
  }
}
// ... existing code ...

// ... existing code ...
// --- Edit Achievement Modal Logic ---
// Store event data globally for demo
let event1Data = {
  heading: 'Event 1',
  category: 'Hackathon',
  pairs: [
    { key: 'Title of Event', value: 'Hack the Waste Hackathon' },
    { key: 'Date', value: 'May 29, 2023' },
    { key: 'Team Name', value: 'Unconventional Technologies' },
    { key: 'Waste Category', value: 'Plastic Waste' },
    { key: 'Proposal', value: 'Smart Waste Management System with Automated Waste Segregation' },
    { key: 'Award', value: '₹25,000' }
  ],
  files: []
};
// ... existing code ...
// --- Achievements Data Array ---
let achievementsData = [];

// Load achievements from localStorage
function loadAchievementsFromStorage() {
  const stored = localStorage.getItem('achievementsData');
  if (stored) {
    try {
      const parsedData = JSON.parse(stored);
      // Convert stored file data back to file-like objects
      achievementsData = parsedData.map(achievement => {
        const convertedAchievement = { ...achievement };
        if (convertedAchievement.files) {
          convertedAchievement.files = convertedAchievement.files.map(file => {
            if (file.data) {
              // Convert base64 back to file-like object
              return base64ToFile(file.data, file.name, file.type);
            }
            return file;
          });
        }
        return convertedAchievement;
      });
    } catch (e) {
      console.error('Error parsing stored achievements:', e);
      achievementsData = [];
    }
  }
  
  // If no stored data, use default
  if (achievementsData.length === 0) {
    achievementsData = [
      {
        heading: 'Event 1',
        category: 'Hackathon',
        pairs: [
          { key: 'Title of Event', value: 'Hack the Waste Hackathon' },
          { key: 'Date', value: 'May 29, 2023' },
          { key: 'Team Name', value: 'Unconventional Technologies' },
          { key: 'Waste Category', value: 'Plastic Waste' },
          { key: 'Proposal', value: 'Smart Waste Management System with Automated Waste Segregation' },
          { key: 'Award', value: '₹25,000' }
        ],
        files: []
      }
    ];
  }
}

// Convert File to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Convert base64 back to File-like object
function base64ToFile(base64Data, fileName, fileType) {
  const byteString = atob(base64Data.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: fileType });
  return {
    name: fileName,
    type: fileType,
    size: blob.size,
    url: URL.createObjectURL(blob),
    data: base64Data
  };
}

// Save achievements to localStorage
async function saveAchievementsToStorage() {
  try {
    // Convert File objects to serializable format
    const serializableData = await Promise.all(achievementsData.map(async (achievement) => {
      const serializedAchievement = { ...achievement };
      if (serializedAchievement.files) {
        serializedAchievement.files = await Promise.all(serializedAchievement.files.map(async (file) => {
          if (file instanceof File) {
            const base64Data = await fileToBase64(file);
            return {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
              data: base64Data
            };
          }
          return file;
        }));
      }
      return serializedAchievement;
    }));
    localStorage.setItem('achievementsData', JSON.stringify(serializableData));
  } catch (e) {
    console.error('Error saving achievements:', e);
  }
}

// --- Render All Achievement Cards ---
function renderAllAchievementCards() {
  const container = document.getElementById('achievementCardsContainer');
  if (!container) return;
  container.innerHTML = '';
  achievementsData.forEach((data, idx) => {
    const card = document.createElement('div');
    card.className = 'achievement-card';
    card.style.background = '#fff';
    card.style.border = '1.5px solid #d1d5db';
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    card.style.width = '100%';
    card.style.maxWidth = '900px';
    card.style.margin = '32px auto 0 auto';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.minHeight = '220px';
    card.style.boxSizing = 'border-box';
    card.innerHTML = `
      <div style="width: 100%; padding: 2.2em 2em 0.5em 2em;">
        <span data-achievement-heading style="font-size: 1.45rem; font-weight: 800; color: #222; letter-spacing: 0.01em; display: block;">${data.heading}</span>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; padding: 0 2em 1.5em 2em;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${data.pairs.map((pair, i) => `
            <li style="display: flex; align-items: flex-start; margin-bottom: ${i === data.pairs.length - 1 ? '1.2em' : '0.5em'};">
              <span style="display: inline-block; width: 10px; height: 10px; background: #111; border-radius: 50%; margin-right: 1em; margin-top: 0.45em;"></span>
              <span style="font-size: 1.13rem; color: #222; font-weight: 600;">${pair.key}: <span style="font-weight: 400; color: #444;">${pair.value}</span></span>
            </li>
          `).join('')}
        </ul>
        <div data-achievement-num-images style="font-size: 1.13rem; color: #222; font-weight: 600; margin-left: 2.1em; margin-bottom: 1.7em;">Number of Images: <span style="font-weight: 400; color: #444;">${(data.files||[]).filter(f=>f.type&&f.type.startsWith('image/')).length}</span></div>
        <div style="display: flex; flex-direction: row; justify-content: flex-end; gap: 0.7em; margin-top: auto;">
          <button class="editAchievementBtn" data-idx="${idx}" style="background: #ffc107; color: #111; border: none; border-radius: 6px; padding: 0.55em 1.5em; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s;">Edit</button>
          <button class="deleteAchievementBtn" data-idx="${idx}" style="background: #dc3545; color: #fff; border: none; border-radius: 6px; padding: 0.55em 1.5em; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s;">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  // Attach edit/delete events
  document.querySelectorAll('.editAchievementBtn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      openEditAchievementModal(achievementsData[idx], idx);
    };
  });
  document.querySelectorAll('.deleteAchievementBtn').forEach(btn => {
    btn.onclick = async function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      achievementsData.splice(idx, 1);
      await saveAchievementsToStorage();
      renderAllAchievementCards();
    };
  });
}

// --- Add New Achievement Button Logic ---
document.getElementById('addAchievementBtn').onclick = async function() {
  // Gather data from Add New Achievement card
  const heading = document.getElementById('achievementCategoryInput').value;
  const pairRows = document.querySelectorAll('#keyValuePairsContainer .key-value-row');
  const pairs = Array.from(pairRows).map(row => {
    return {
      key: row.querySelector('.achievementKeyInput').value,
      value: row.querySelector('.achievementValueInput').value
    };
  });
  // Gather files
  const fileInput = document.getElementById('achievementFileInput');
  const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
  // Add to achievementsData
  achievementsData.push({ heading, pairs, files });
  await saveAchievementsToStorage();
  // Clear inputs
  document.getElementById('achievementCategoryInput').value = '';
  pairRows.forEach(row => row.remove());
  fileInput.value = '';
  document.getElementById('filePreviewContainer').innerHTML = '';
  // Re-render all cards
  renderAllAchievementCards();
};

// --- On page load, render all cards ---
document.addEventListener('DOMContentLoaded', function() {
  // Load achievements from localStorage
  loadAchievementsFromStorage();
  
  // Add a container for achievement cards if not present
  let container = document.getElementById('achievementCardsContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'achievementCardsContainer';
    container.style.width = '100%';
    container.style.maxWidth = '900px';
    container.style.margin = '0 auto';
    document.getElementById('achievementsSection').appendChild(container);
  }
  renderAllAchievementCards();

  // Attach event to the static Event 1 Edit button
  const event1EditBtn = document.querySelector('#event1Card button');
  if (event1EditBtn) {
    event1EditBtn.onclick = async function() {
      // Find the achievement with heading 'Event 1'
      let idx = achievementsData.findIndex(a => a.heading && a.heading.trim().toLowerCase() === 'event 1');
      if (idx === -1) {
        // Add default Event 1 achievement if not found
        const defaultEvent1 = {
          heading: 'Event 1',
          category: 'Hackathon',
          pairs: [
            { key: 'Title of Event', value: 'Hack the Waste Hackathon' },
            { key: 'Date', value: 'May 29, 2023' },
            { key: 'Team Name', value: 'Unconventional Technologies' },
            { key: 'Waste Category', value: 'Plastic Waste' },
            { key: 'Proposal', value: 'Smart Waste Management System with Automated Waste Segregation' },
            { key: 'Award', value: '₹25,000' }
          ],
          files: []
        };
        achievementsData.unshift(defaultEvent1);
        idx = 0;
        await saveAchievementsToStorage();
      }
      openEditAchievementModal(achievementsData[idx], idx);
    };
  }
});

// --- Edit Achievement Modal: update to use achievementsData and idx ---
function openEditAchievementModal(eventData, idx) {
  // Show overlay and modal
  document.getElementById('editAchievementOverlay').style.display = 'block';
  document.getElementById('editAchievementModal').style.display = 'block';

  // Populate heading
  document.getElementById('editAchievementCategoryInput').value = eventData.heading;

  // Key-value pairs
  const container = document.getElementById('editKeyValuePairsContainer');
  container.innerHTML = '';
  (eventData.pairs || []).forEach(pair => {
    const row = document.createElement('div');
    row.className = 'key-value-row';
    row.style.display = 'flex';
    row.style.gap = '1.2em';
    row.style.marginBottom = '1.1em';
    row.style.alignItems = 'flex-start';
    row.innerHTML = `
      <div style="flex: 1; position: relative;">
        <input class="achievementKeyInput" type="text" placeholder="Key" value="${pair.key}" style="width: 100%; height: 38px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" autocomplete="off" />
      </div>
      <div style="flex: 1; position: relative;">
        <input class="achievementValueInput" type="text" placeholder="Value" value="${pair.value}" style="width: 100%; height: 38px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" autocomplete="off" />
      </div>
      <span class="deletePairBtn" style="margin-left: 16px; margin-top: 2px; cursor: pointer; color: #dc3545; font-size: 1.3rem; display: flex; align-items: center; background: #fff; padding-left: 2px; height: 38px; align-self: center;" title="Delete pair">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
    `;
    row.querySelector('.deletePairBtn').onclick = function() { row.remove(); };
    container.appendChild(row);
  });

  // Add pair button
  document.getElementById('editAddPairBtn').onclick = function() {
    const row = document.createElement('div');
    row.className = 'key-value-row';
    row.style.display = 'flex';
    row.style.gap = '1.2em';
    row.style.marginBottom = '1.1em';
    row.style.alignItems = 'flex-start';
    row.innerHTML = `
      <div style="flex: 1; position: relative;">
        <input class="achievementKeyInput" type="text" placeholder="Key" style="width: 100%; height: 38px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" autocomplete="off" />
      </div>
      <div style="flex: 1; position: relative;">
        <input class="achievementValueInput" type="text" placeholder="Value" style="width: 100%; height: 38px; font-size: 1rem; color: #222; background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 0.4em 1em; outline: none; transition: border-color 0.3s; box-sizing: border-box;" autocomplete="off" />
      </div>
      <span class="deletePairBtn" style="margin-left: 16px; margin-top: 2px; cursor: pointer; color: #dc3545; font-size: 1.3rem; display: flex; align-items: center; background: #fff; padding-left: 2px; height: 38px; align-self: center;" title="Delete pair">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
    `;
    row.querySelector('.deletePairBtn').onclick = function() { row.remove(); };
    container.appendChild(row);
  };

  // File upload logic (reset and preview)
  const fileInput = document.getElementById('editAchievementFileInput');
  const filePreviewContainer = document.getElementById('editFilePreviewContainer');
  fileInput.value = '';
  filePreviewContainer.innerHTML = '';
  (eventData.files || []).forEach((file, idx2) => {
    // ... file preview logic ...
  });
  document.getElementById('editUploadBox').onclick = function(e) {
    if (e.target === fileInput) return;
    fileInput.click();
  };
  fileInput.onchange = function() {
    // Append new files to eventData.files, avoiding duplicates by name+size
    const existingFiles = eventData.files || [];
    const newFiles = Array.from(fileInput.files);
    newFiles.forEach(newFile => {
      if (!existingFiles.some(f => f.name === newFile.name && f.size === newFile.size)) {
        existingFiles.push(newFile);
      }
    });
    eventData.files = existingFiles;
    openEditAchievementModal(eventData, idx);
  };

  // Cancel/close logic
  function closeEditAchievementModal() {
    document.getElementById('editAchievementOverlay').style.display = 'none';
    document.getElementById('editAchievementModal').style.display = 'none';
  }
  document.getElementById('editAchievementCancelBtn').onclick = closeEditAchievementModal;
  document.getElementById('editAchievementOverlay').onclick = closeEditAchievementModal;

  // Update button logic
  document.getElementById('editAchievementUpdateBtn').onclick = async function() {
    // Get updated heading
    achievementsData[idx].heading = document.getElementById('editAchievementCategoryInput').value;
    // Get updated pairs
    const rows = container.querySelectorAll('.key-value-row');
    achievementsData[idx].pairs = Array.from(rows).map(row => {
      return {
        key: row.querySelector('.achievementKeyInput').value,
        value: row.querySelector('.achievementValueInput').value
      };
    });
    // Files are already updated in eventData.files
    achievementsData[idx].files = eventData.files;
    await saveAchievementsToStorage();
    renderAllAchievementCards();
    closeEditAchievementModal();
  };

  // After rendering key-value pairs and add pair button
  const currentImagesContainer = document.getElementById('editCurrentImagesContainer');
  if (currentImagesContainer) {
    currentImagesContainer.innerHTML = '';
    (eventData.files || []).forEach((file, idx2) => {
      if (file.type && file.type.startsWith('image/')) {
        const fileDiv = document.createElement('div');
        fileDiv.style.position = 'relative';
        fileDiv.style.display = 'inline-block';
        fileDiv.style.width = '250.04px';
        fileDiv.style.height = '250.04px';
        fileDiv.style.border = '1px solid #e9ecef';
        fileDiv.style.borderRadius = '8px';
        fileDiv.style.overflow = 'hidden';
        fileDiv.style.background = '#fff';
        fileDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        let content = document.createElement('img');
        content.src = file.url || (file instanceof File ? URL.createObjectURL(file) : '');
        content.style.width = '100%';
        content.style.height = '100%';
        content.style.objectFit = 'cover';
        fileDiv.appendChild(content);
        // Remove icon
        const cross = document.createElement('span');
        cross.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        cross.style.position = 'absolute';
        cross.style.top = '6px';
        cross.style.right = '6px';
        cross.style.background = '#fff';
        cross.style.borderRadius = '50%';
        cross.style.padding = '2px';
        cross.style.cursor = 'pointer';
        cross.style.display = 'none';
        cross.style.zIndex = '2';
        fileDiv.appendChild(cross);
        fileDiv.onmouseenter = () => { cross.style.display = 'block'; };
        fileDiv.onmouseleave = () => { cross.style.display = 'none'; };
        cross.onclick = function() {
          eventData.files.splice(idx2, 1);
          openEditAchievementModal(eventData, idx);
        };
        currentImagesContainer.appendChild(fileDiv);
      }
    });
  }
}

// Utility to update the static Event 1 card's number of images
function updateEvent1CardImageCount() {
  const event1NumImages = document.querySelector('#event1Card [data-event1-num-images] span');
  if (event1NumImages) {
    const event1 = achievementsData.find(a => a.heading && a.heading.trim().toLowerCase() === 'event 1');
    const count = event1 && event1.files ? event1.files.filter(f => f.type && f.type.startsWith('image/')).length : 0;
    event1NumImages.textContent = count;
  }
}

// Call this after every edit to Event 1
// 1. After saving in openEditAchievementModal
const originalEditAchievementUpdateBtn = document.getElementById('editAchievementUpdateBtn') && document.getElementById('editAchievementUpdateBtn').onclick;
document.addEventListener('DOMContentLoaded', function() {
  // ...existing code...
  // Patch the update button logic for the edit modal
  const updateBtn = document.getElementById('editAchievementUpdateBtn');
  if (updateBtn) {
    const oldHandler = updateBtn.onclick;
    updateBtn.onclick = async function() {
      if (oldHandler) await oldHandler.apply(this, arguments);
      updateEvent1CardImageCount();
    };
  }
  // Also update on page load
  updateEvent1CardImageCount();
});
// Also call updateEvent1CardImageCount after adding/removing images in the modal, if needed.

// Restore Event 2 card if missing
function restoreEvent2Card() {
  const exists = achievementsData.some(a => a.heading && a.heading.trim().toLowerCase() === 'event 2');
  if (!exists) {
    achievementsData.push({
      heading: 'Event 2',
      category: 'Hackathon',
      pairs: [
        { key: 'Title of Event', value: 'Sample Event 2 Title' },
        { key: 'Date', value: 'June 1, 2023' },
        { key: 'Team Name', value: 'Team Example' },
        { key: 'Waste Category', value: 'E-Waste' },
        { key: 'Proposal', value: 'Automated E-Waste Sorting System' },
        { key: 'Award', value: '₹10,000' }
      ],
      files: []
    });
    saveAchievementsToStorage().then(() => {
      renderAllAchievementCards();
    });
  }
}

// Call restoreEvent2Card on page load, before rendering cards
const origDOMContentLoaded = document.addEventListener;
document.addEventListener = function(type, listener, options) {
  if (type === 'DOMContentLoaded') {
    origDOMContentLoaded.call(document, type, function(e) {
      restoreEvent2Card();
      if (typeof listener === 'function') listener(e);
    }, options);
  } else {
    origDOMContentLoaded.call(document, type, listener, options);
  }
};

// ... existing code ...
// --- Focus/blur border color for all relevant inputs ---
function setFocusBlurBlue(input) {
  input.addEventListener('focus', function() {
    input.style.borderColor = '#007bff';
  });
  input.addEventListener('blur', function() {
    input.style.borderColor = '#e9ecef';
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Research Verticals Add Card: Name input
  var rvName = document.getElementById('researchVerticalNameInput');
  if (rvName) setFocusBlurBlue(rvName);

  // Research Verticals Add Card: Overview textarea
  var rvOverview = document.getElementById('researchVerticalOverviewInput');
  if (rvOverview) {
    setFocusBlurBlue(rvOverview);
    // Auto-resize logic
    function autoResizeRVOverview() {
      rvOverview.style.height = 'auto';
      rvOverview.style.height = rvOverview.scrollHeight + 'px';
    }
    rvOverview.addEventListener('input', autoResizeRVOverview);
    // Initial resize
    autoResizeRVOverview();
  }
});
// ... existing code ...

// ... existing code ...
// Utility: Save main card data to localStorage
function saveMainCardData(data) {
  localStorage.setItem('mainCardData', JSON.stringify(data));
}
// Utility: Load main card data from localStorage
function loadMainCardData() {
  const data = localStorage.getItem('mainCardData');
  if (data) return JSON.parse(data);
  // Default data if nothing in storage
  return {
    name: 'Dr. Saurabh Kumar',
    role: 'Faculty Coordinator',
    info: 'Assistant Professor, Department of CSE, LNMIIT Jaipur',
    imageSrc: 'Dr_Saurabh_Kumar.png',
    rollNumber: '',
    socialLinks: []
  };
}

// On page load, render main card from storage
window.addEventListener('DOMContentLoaded', function() {
  const data = loadMainCardData();
  renderMainCardFromData(data);
  // Attach edit modal open logic
  const editBtn = document.getElementById('editSaurabhKumarBtn');
  if (editBtn) {
    editBtn.onclick = function() {
      window.initializeEditModal();
      document.getElementById('editPersonModal').style.display = 'flex';
    };
  }
});

// Render main card from data
function renderMainCardFromData(data) {
  const mainCard = document.getElementById('saurabhKumarCard');
  if (!mainCard) return;
  // Name
  const nameSpan = mainCard.querySelector('span[style*="font-weight: 600; color: #111; font-size: 1.13rem"]');
  if (nameSpan) nameSpan.textContent = data.name;
  // Role badge
  const roleBadge = mainCard.querySelector('#mainCardRoleBadge');
  if (roleBadge) roleBadge.textContent = data.rollNumber && data.role.match(/phd researcher|m.tech. researcher|student/i) ? `${data.role} - ${data.rollNumber}` : data.role;
  // Info (only info text)
  const infoSpan = mainCard.querySelector('ul li span[style*="color: #888; font-size: 0.97rem; white-space: nowrap"]');
  if (infoSpan) infoSpan.textContent = data.info;
  // Image
  const img = mainCard.querySelector('img[alt="Dr. Saurabh Kumar"]');
  if (img) img.src = data.imageSrc;
  // Social links count (next to link icon)
  const socialLinksDiv = mainCard.querySelector('div[style*="display: flex; align-items: center; gap: 0.5em; margin-top: 0.2em;"]');
  if (socialLinksDiv) {
    const countSpan = socialLinksDiv.querySelector('span[style*="color: #888; font-size: 0.97rem;"]');
    if (countSpan) countSpan.textContent = `${data.socialLinks.length} Social Link${data.socialLinks.length !== 1 ? 's' : ''}`;
  }
}

// When opening the edit modal, always load from storage
window.initializeEditModal = function() {
  const data = loadMainCardData();
  // Set fields in edit modal
  const editNameInput = document.getElementById('editPersonNameInput');
  const editRoleSelected = document.getElementById('editPersonRoleSelected');
  const editInfoInput = document.getElementById('editPersonInfoInput');
  const editAvatarIcon = document.getElementById('editPersonAvatarIcon');
  const editRollNumberInput = document.getElementById('editRollNumberInput');
  if (editNameInput) editNameInput.value = data.name;
  if (editRoleSelected) editRoleSelected.textContent = data.role;
  if (editInfoInput) editInfoInput.value = data.info;
  if (editAvatarIcon) editAvatarIcon.src = data.imageSrc;
  if (editRollNumberInput) editRollNumberInput.value = data.rollNumber;
  // Social links
  window.editSocialLinks = Array.isArray(data.socialLinks) ? JSON.parse(JSON.stringify(data.socialLinks)) : [];
  window.renderEditSocialLinks();
  // Show/hide roll number field
  const editRollField = document.getElementById('editRollNumberField');
  if (editRollField) {
    const roleLower = data.role.toLowerCase();
    const rolesWithRollNumber = ['phd researcher', 'm.tech. researcher', 'student'];
    if (rolesWithRollNumber.includes(roleLower)) {
      editRollField.style.display = 'flex';
    } else {
      editRollField.style.display = 'none';
    }
  }
};

// Update person and save to storage
window.updatePerson = function() {
  // Always get the index
  const idx = window.currentEditPersonIdx;
  let people = loadPeopleData();
  if (typeof idx === 'number' && people[idx]) {
    // Update existing
    people[idx] = {
      name: document.getElementById('editPersonNameInput').value,
      role: document.getElementById('editPersonRoleSelected').textContent,
      info: document.getElementById('editPersonInfoInput').value,
      imageSrc: document.getElementById('editPersonAvatarIcon').src,
      rollNumber: document.getElementById('editRollNumberInput')?.value || '',
      socialLinks: Array.isArray(window.editSocialLinks) ? JSON.parse(JSON.stringify(window.editSocialLinks)) : [],
      showInPeople: document.getElementById('editShowInPeopleCheckbox')?.checked || false
    };
    savePeopleData(people);
    renderAllPeopleCards();

    // Update main card if the name matches
    const mainCard = document.getElementById('saurabhKumarCard');
    if (mainCard) {
      const mainName = mainCard.querySelector('.person-name')?.textContent?.trim();
      if (mainName === people[idx].name) {
        // Update all main card fields
        const img = mainCard.querySelector('.person-avatar');
        if (img) img.src = people[idx].imageSrc;
        const nameEl = mainCard.querySelector('.person-name');
        if (nameEl) nameEl.textContent = people[idx].name;
        const infoEl = mainCard.querySelector('.person-info');
        if (infoEl) infoEl.textContent = people[idx].info;
        const roleEl = mainCard.querySelector('.person-role-badge');
        if (roleEl) roleEl.textContent = people[idx].role;
        // Social links
        const socialLinksEl = mainCard.querySelector('.person-social-links');
        if (socialLinksEl) {
          socialLinksEl.innerHTML = '';
          (people[idx].socialLinks || []).forEach(link => {
            if (link.type && link.url) {
              const a = document.createElement('a');
              a.href = link.url;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.className = 'person-social-link';
              a.textContent = link.type;
              socialLinksEl.appendChild(a);
            }
          });
        }
      }
    }
  }
  // Close modal if needed
  const modal = document.getElementById('editPersonModal');
  if (modal) modal.style.display = 'none';
};
// ... existing code ...

// ... existing code ...
// --- MULTI-PERSON SUPPORT ---

// Utility: Save all people to localStorage
function savePeopleData(arr) {
  localStorage.setItem('peopleData', JSON.stringify(arr));
}
// Utility: Load all people from localStorage
function loadPeopleData() {
  const data = localStorage.getItem('peopleData');
  if (data) return JSON.parse(data);
  // Default: one person
  return [{
    name: 'Dr. Saurabh Kumar',
    role: 'Faculty Coordinator',
    info: 'Assistant Professor, Department of CSE, LNMIIT Jaipur',
    imageSrc: 'Dr_Saurabh_Kumar.png',
    rollNumber: '',
    socialLinks: []
  }];
}

// Render all people cards
function renderAllPeopleCards() {
  console.log("renderAllPeopleCards called");
  const people = loadPeopleData();
  const container = document.getElementById('peopleCardsContainer');
  if (!container) return;
  container.innerHTML = '';
  people.forEach((person, idx) => {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.style = 'position: relative; background: #fff; border: 1.5px solid #d1d5db; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 2.2em 2em 2em 2em; width: 100%; max-width: 900px; min-height: 220px; display: flex; flex-direction: row; align-items: flex-start; margin-bottom: 2em;';
    // Split info by semicolon and trim
    const infoPoints = (person.info || '').split(';').map(s => s.trim()).filter(Boolean);
    card.innerHTML = `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start;">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
          <img src="${person.imageSrc}" alt="${person.name}" style="width: 82px; height: 82px; border-radius: 50%; object-fit: cover; border: 2.5px solid #e9ecef; margin-bottom: 0.7em;" />
          <span style="font-weight: 600; color: #111; font-size: 1.13rem; margin-bottom: 0.3em;">${person.name}</span>
          <ul style="list-style: none; padding: 0; margin: 0 0 0.5em 0;">
            ${infoPoints.map(point => `<li style='display: flex; align-items: flex-start; gap: 0.5em;'><span style='display: inline-block; width: 10px; height: 10px; background: #007bff; border-radius: 50%; margin-right: 0.7em; margin-top: 0.35em;'></span><span style='color: #888; font-size: 0.97rem; white-space: nowrap;'>${point}</span></li>`).join('')}
          </ul>
          <div style="display: flex; align-items: center; gap: 0.5em; margin-top: 0.2em;">
            <img src="https://w7.pngwing.com/pngs/279/877/png-transparent-hyperlink-computer-icons-link-text-logo-number.png" alt="link logo" style="width: 18px; height: 18px; object-fit: contain; margin-right: 0.3em;" />
            <span style="color: #888; font-size: 0.97rem;">${person.socialLinks.length} Social Link${person.socialLinks.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start; min-height: 120px; position: relative;">
        <div style="align-self: flex-end;">
          <span id="mainCardRoleBadge${idx}" style="background: #f2f2f2; color: #444; font-size: 0.97rem; font-weight: 600; border-radius: 16px; padding: 0.32em 1.2em; display: inline-block; border: 1.5px solid #bbb;">${person.rollNumber && person.role.match(/phd researcher|m.tech. researcher|student/i) ? `${person.role} - ${person.rollNumber}` : person.role}</span>
        </div>
      </div>
      <div style="position: absolute; bottom: 15px; right: 15px; display: flex; flex-direction: row; gap: 0.7em; align-items: center;">
          <button class="editPersonBtn" data-idx="${idx}" style="background: #ffc107; color: #111; border: none; border-radius: 7px; padding: 0.6em 1.5em; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">Edit</button>
          <button class="deletePersonBtn" data-idx="${idx}" style="background: #dc3545; color: #fff; border: none; border-radius: 7px; padding: 0.6em 1.5em; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
  // Attach edit/delete logic
  Array.from(container.getElementsByClassName('editPersonBtn')).forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      openEditModalForPerson(idx);
    };
  });
  Array.from(container.getElementsByClassName('deletePersonBtn')).forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      let people = loadPeopleData();
      people.splice(idx, 1);
      savePeopleData(people);
      renderAllPeopleCards();
    };
  });
}

// Open edit modal for a specific person
function openEditModalForPerson(idx) {
  const people = loadPeopleData();
  const person = people[idx];
  if (!person) return;
  // Set fields in edit modal
  const editNameInput = document.getElementById('editPersonNameInput');
  const editRoleSelected = document.getElementById('editPersonRoleSelected');
  const editInfoInput = document.getElementById('editPersonInfoInput');
  const editAvatarIcon = document.getElementById('editPersonAvatarIcon');
  const editRollNumberInput = document.getElementById('editRollNumberInput');
  if (editNameInput) editNameInput.value = person.name;
  if (editRoleSelected) editRoleSelected.textContent = person.role;
  if (editInfoInput) editInfoInput.value = person.info;
  if (editAvatarIcon) editAvatarIcon.src = person.imageSrc;
  if (editRollNumberInput) editRollNumberInput.value = person.rollNumber;
  // Social links
  window.editSocialLinks = Array.isArray(person.socialLinks) ? JSON.parse(JSON.stringify(person.socialLinks)) : [];
  window.renderEditSocialLinks();
  // Show/hide roll number field
  const editRollField = document.getElementById('editRollNumberField');
  if (editRollField) {
    const roleLower = person.role.toLowerCase();
    const rolesWithRollNumber = ['phd researcher', 'm.tech. researcher', 'student'];
    if (rolesWithRollNumber.includes(roleLower)) {
      editRollField.style.display = 'flex';
    } else {
      editRollField.style.display = 'none';
    }
  }
  // Store which person is being edited
  window.currentEditPersonIdx = idx;

  // Show the modal
  document.getElementById('editPersonModal').style.display = 'flex';
  attachEditModalListeners();
}

// Update person and save to storage (for multi-person)
window.updatePerson = function() {
  // Always get the index
  const idx = window.currentEditPersonIdx;
  let people = loadPeopleData();
  if (typeof idx === 'number' && people[idx]) {
    // Update existing
    people[idx] = {
      name: document.getElementById('editPersonNameInput').value,
      role: document.getElementById('editPersonRoleSelected').textContent,
      info: document.getElementById('editPersonInfoInput').value,
      imageSrc: document.getElementById('editPersonAvatarIcon').src,
      rollNumber: document.getElementById('editRollNumberInput')?.value || '',
      socialLinks: Array.isArray(window.editSocialLinks) ? JSON.parse(JSON.stringify(window.editSocialLinks)) : [],
      showInPeople: document.getElementById('editShowInPeopleCheckbox')?.checked || false
    };
    savePeopleData(people);
    renderAllPeopleCards();
    document.getElementById('editPersonModal').style.display = 'none';
    window.currentEditPersonIdx = undefined;
  } else {
    // fallback: close modal and do nothing
    document.getElementById('editPersonModal').style.display = 'none';
  }
};

// Cancel only closes modal and resets UI
window.cancelEditPerson = function() {
  document.getElementById('editPersonModal').style.display = 'none';
};

// Add New Person logic
const createPersonBtn = document.getElementById('createPersonBtn');
if (createPersonBtn) {
  createPersonBtn.onclick = function() {
    // Gather data from Add New Person card
    const name = document.getElementById('personNameInput').value.trim();
    const role = document.getElementById('personRoleSelected').textContent.trim();
    const rollNumber = document.getElementById('personRollNumberInput')?.value.trim() || '';
    const info = document.getElementById('personInfoInput').value.trim();
    const imageSrc = document.getElementById('personAvatarIcon').src;
    const showInPeople = document.getElementById('addShowInPeopleCheckbox')?.checked || false;
    // Social links
    let socialLinks = [];
    if (window.socialLinks && Array.isArray(window.socialLinks)) {
      socialLinks = JSON.parse(JSON.stringify(window.socialLinks));
    }
    // Validate required fields
    if (!name || !role || role === 'Select Role') {
      alert('Please fill in all required fields.');
      return;
    }
    // Add new person to data
    let people = loadPeopleData();
    people.push({ name, role, rollNumber, info, imageSrc, socialLinks, showInPeople });
    savePeopleData(people);
    renderAllPeopleCards();
    // Clear form fields
    document.getElementById('personNameInput').value = '';
    document.getElementById('personRoleSelected').textContent = 'Select Role';
    document.getElementById('personRollNumberInput').value = '';
    document.getElementById('personInfoInput').value = '';
    document.getElementById('personAvatarIcon').src = 'https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png';
    if (window.socialLinks && Array.isArray(window.socialLinks)) {
      window.socialLinks = [];
      if (typeof window.renderSocialLinks === 'function') window.renderSocialLinks();
    }
    document.getElementById('addShowInPeopleCheckbox').checked = false;
  };
}

// On page load, render all people cards
window.addEventListener('DOMContentLoaded', function() {
  // ... other code ...
  renderAllPeopleCards();
});
// ... existing code ...

function syncMainCardWithFirstPerson() {
  const people = loadPeopleData();
  if (people && people.length > 0) {
    saveMainCardData(people[0]);
    renderMainCardFromData(people[0]);
  }
}

function deletePublicationCard(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.remove();
  }
}

// ... existing code ...

// Modal state
let currentEditCardId = null;
let originalType = '';
let originalDescription = '';

function openEditModal(cardId) {
  currentEditCardId = cardId;
  // Get current values from the card
  const card = document.getElementById(cardId);
  const type = card.querySelector('.publication-title').innerText;
  const description = card.querySelector('.publication-details').innerText;
  // Set modal values
  document.getElementById('edit-type-selected').innerText = type;
  document.getElementById('edit-description').value = description;
  // Store original values for cancel
  originalType = type;
  originalDescription = description;
  // Show modal
  document.getElementById('edit-publication-modal').style.display = 'flex';
  // Close dropdown if open
  document.getElementById('edit-type-options').style.display = 'none';
}

function closeEditModal() {
  // Reset modal values to original
  document.getElementById('edit-type-selected').innerText = originalType;
  document.getElementById('edit-description').value = originalDescription;
  document.getElementById('edit-publication-modal').style.display = 'none';
}

function toggleTypeDropdown() {
  const options = document.getElementById('edit-type-options');
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
  // Close dropdown if click outside
  const dropdown = document.getElementById('edit-type-dropdown');
  const options = document.getElementById('edit-type-options');
  if (options && options.style.display === 'block' && !dropdown.contains(event.target)) {
    options.style.display = 'none';
  }
});

// Dropdown option selection
const typeOptions = document.querySelectorAll('.edit-dropdown-option');
typeOptions.forEach(option => {
  option.addEventListener('mouseenter', function() {
    typeOptions.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
  });
  option.addEventListener('mouseleave', function() {
    this.classList.remove('active');
  });
  option.addEventListener('click', function() {
    document.getElementById('edit-type-selected').innerText = this.innerText;
    document.getElementById('edit-type-options').style.display = 'none';
  });
});

function updatePublication() {
  if (!currentEditCardId) return;
  const card = document.getElementById(currentEditCardId);
  const newType = document.getElementById('edit-type-selected').innerText;
  const newDescription = document.getElementById('edit-description').value;
  // Update main card
  card.querySelector('.publication-title').innerText = newType;
  card.querySelector('.publication-details').innerText = newDescription;
  // Close modal
  document.getElementById('edit-publication-modal').style.display = 'none';
}
// ... existing code ...

document.addEventListener('DOMContentLoaded', function() {
  // Dropdown option selection for edit modal
  const typeOptions = document.querySelectorAll('.edit-dropdown-option');
  typeOptions.forEach(option => {
    option.addEventListener('mouseenter', function() {
      typeOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
    option.addEventListener('mouseleave', function() {
      this.classList.remove('active');
    });
    option.addEventListener('click', function() {
      document.getElementById('edit-type-selected').innerText = this.innerText;
      document.getElementById('edit-type-options').style.display = 'none';
    });
  });
});

// ... keep the rest of the modal logic as is ...

// Helper: get and set publication data in localStorage
function getPublicationData(cardId) {
  const data = localStorage.getItem('publication_' + cardId);
  return data ? JSON.parse(data) : null;
}
function setPublicationData(cardId, type, description) {
  localStorage.setItem('publication_' + cardId, JSON.stringify({ type, description }));
}

// On page load, populate publication card from localStorage if available
window.addEventListener('DOMContentLoaded', function() {
  const cardId = 'publication-card-1';
  const card = document.getElementById(cardId);
  if (card) {
    const data = getPublicationData(cardId);
    if (data) {
      card.querySelector('.publication-title').innerText = data.type;
      card.querySelector('.publication-details').innerText = data.description;
    }
  }
});

// Update updatePublication to save to localStorage
function updatePublication() {
  if (!currentEditCardId) return;
  const card = document.getElementById(currentEditCardId);
  const newType = document.getElementById('edit-type-selected').innerText;
  const newDescription = document.getElementById('edit-description').value;
  // Update main card
  card.querySelector('.publication-title').innerText = newType;
  card.querySelector('.publication-details').innerText = newDescription;
  // Save to localStorage
  setPublicationData(currentEditCardId, newType, newDescription);
  // Close modal
  document.getElementById('edit-publication-modal').style.display = 'none';
}
// ... existing code ...

// ... existing code ...

// Helper: get and set all publication cards in localStorage
function getAllPublications() {
  const data = localStorage.getItem('publications_list');
  return data ? JSON.parse(data) : [];
}
function setAllPublications(list) {
  localStorage.setItem('publications_list', JSON.stringify(list));
}
// Render all publication cards
function renderPublicationCards() {
  const container = document.getElementById('publicationCardsContainer');
  if (!container) return;
  container.innerHTML = '';
  const publications = getAllPublications();
  publications.forEach(pub => {
    const card = createPublicationCard(pub);
    container.appendChild(card);
  });
}

// Create a publication card DOM element
function createPublicationCard(pub) {
  const card = document.createElement('div');
  card.className = 'publication-card';
  card.id = pub.id;
  card.innerHTML = `
    <div class="file-icon-and-text">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ttMCWFYQ3JxN8cLIfxlN43bPxyHTgt9zTQ&s" alt="File Icon" class="file-icon" />
      <div class="publication-title">${pub.type}</div>
      <div class="publication-details">${pub.description}</div>
      <div class="publication-actions">
        <button class="edit-btn" onclick="openEditModal('${pub.id}')">Edit</button>
        <button class="delete-btn" onclick="deletePublicationCard('${pub.id}')">Delete</button>
      </div>
    </div>
  `;
  return card;
}

// Add new publication
function addPublication() {
  const type = document.getElementById('publicationTypeSelected').textContent;
  const description = document.getElementById('publicationDescriptionInput').value;
  if (!type || type === 'Select type' || !description.trim()) {
    alert('Please fill all fields.');
    return;
  }
  const publications = getAllPublications();
  const id = 'publication-card-' + (Date.now());
  publications.push({ id, type, description });
  setAllPublications(publications);
  renderPublicationCards();
  // Optionally, clear form
  document.getElementById('publicationTypeSelected').textContent = 'Select type';
  document.getElementById('publicationDescriptionInput').value = '';
}

// Delete publication card
function deletePublicationCard(cardId) {
  let publications = getAllPublications();
  publications = publications.filter(pub => pub.id !== cardId);
  setAllPublications(publications);
  renderPublicationCards();
}

// Edit modal logic (update to work with dynamic cards)
function openEditModal(cardId) {
  currentEditCardId = cardId;
  const publications = getAllPublications();
  const pub = publications.find(p => p.id === cardId);
  if (!pub) return;
  document.getElementById('edit-type-selected').innerText = pub.type;
  document.getElementById('edit-description').value = pub.description;
  originalType = pub.type;
  originalDescription = pub.description;
  document.getElementById('edit-publication-modal').style.display = 'flex';
  document.getElementById('edit-type-options').style.display = 'none';
}

function updatePublication() {
  if (!currentEditCardId) return;
  const newType = document.getElementById('edit-type-selected').innerText;
  const newDescription = document.getElementById('edit-description').value;
  let publications = getAllPublications();
  publications = publications.map(pub => pub.id === currentEditCardId ? { ...pub, type: newType, description: newDescription } : pub);
  setAllPublications(publications);
  renderPublicationCards();
  document.getElementById('edit-publication-modal').style.display = 'none';
}

// On page load, render all publication cards
window.addEventListener('DOMContentLoaded', function() {
  // Add a container for publication cards if not present
  let container = document.getElementById('publicationCardsContainer');
  if (!container) {
    const addPubCard = document.querySelector('div[style*="Add New Publication"]');
    container = document.createElement('div');
    container.id = 'publicationCardsContainer';
    addPubCard.parentNode.insertBefore(container, addPubCard.nextSibling);
  }
  renderPublicationCards();
  // Attach addPublication to button
  const addBtn = document.getElementById('addPublicationBtn');
  if (addBtn) addBtn.onclick = addPublication;
});

// ... existing code ...

// On page load, ensure the static card is in the publications list
window.addEventListener('DOMContentLoaded', function() {
  // Add a container for publication cards if not present
  let container = document.getElementById('publicationCardsContainer');
  if (!container) {
    const addPubCard = document.querySelector('div[style*="Add New Publication"]');
    container = document.createElement('div');
    container.id = 'publicationCardsContainer';
    addPubCard.parentNode.insertBefore(container, addPubCard.nextSibling);
  }

  // Ensure the static card is in the publications list
  const publications = getAllPublications();
  const staticId = 'publication-card-1';
  const staticCard = document.getElementById(staticId);
  if (staticCard && !publications.some(pub => pub.id === staticId)) {
    publications.unshift({
      id: staticId,
      type: staticCard.querySelector('.publication-title').innerText,
      description: staticCard.querySelector('.publication-details').innerText
    });
    setAllPublications(publications);
  }

  renderPublicationCards();
  // Attach addPublication to button
  const addBtn = document.getElementById('addPublicationBtn');
  if (addBtn) addBtn.onclick = addPublication;
});

// When rendering, also update the static card in the DOM
function renderPublicationCards() {
  const container = document.getElementById('publicationCardsContainer');
  if (!container) return;
  container.innerHTML = '';
  const publications = getAllPublications();
  publications.forEach(pub => {
    if (pub.id === 'publication-card-1') {
      // Update the static card in the DOM
      const staticCard = document.getElementById('publication-card-1');
      if (staticCard) {
        staticCard.querySelector('.publication-title').innerText = pub.type;
        staticCard.querySelector('.publication-details').innerText = pub.description;
      }
    } else {
      const card = createPublicationCard(pub);
      container.appendChild(card);
    }
  });
}

// ... existing code ...

// Ensure the global array exists
if (!window.editSocialLinks) window.editSocialLinks = [];

// Add Social Link button logic
document.getElementById('editAddSocialLinkBtn').onclick = function() {
  // Add a new empty social link object
  window.editSocialLinks.push({ type: '', url: '' });
  // Re-render the social links UI
  window.renderEditSocialLinks();
};

function attachEditModalListeners() {
  // Add Social Link button
  const addBtn = document.getElementById('editAddSocialLinkBtn');
  if (addBtn) {
    addBtn.onclick = function() {
      if (!window.editSocialLinks) window.editSocialLinks = [];
      window.editSocialLinks.push({ type: '', url: '' });
      window.renderEditSocialLinks();
      attachEditModalListeners(); // re-attach after re-render
    };
  }

  // Upload Image button: open file explorer
  const uploadBtn = document.getElementById('editUploadImageBtn');
  const imageInput = document.getElementById('editPersonImageInput');
  if (uploadBtn && imageInput) {
    uploadBtn.onclick = function() {
      imageInput.value = '';
      imageInput.click();
    };
  }

  // Cancel button
  const cancelBtn = document.getElementById('cancelEditPersonBtn');
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      document.getElementById('editPersonModal').style.display = 'none';
    };
  }

  // Update Person button
  const updateBtn = document.getElementById('saveEditPersonBtn');
  if (updateBtn) {
    updateBtn.onclick = function() {
      window.updatePerson();
    };
  }

  // Social Link Delete buttons (re-attach after every render)
  document.querySelectorAll('.edit-social-delete-btn').forEach((btn, idx) => {
    btn.onclick = function() {
      window.editSocialLinks.splice(idx, 1);
      window.renderEditSocialLinks();
      attachEditModalListeners(); // re-attach after re-render
    };
  });

  // Crop card logic for image cropping
  if (imageInput) {
    imageInput.onchange = function() {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        // Show crop card
        const cropCard = document.getElementById('editCropCard');
        const cropImg = document.getElementById('editCropImagePreview');
        if (cropCard && cropImg) {
          cropImg.src = e.target.result;
          cropCard.style.display = 'block';
          // Set header and buttons
          const header = cropCard.querySelector('.edit-crop-header span');
          if (header) header.textContent = 'Adjust Profile Image';
          // Initialize cropper
          if (window.editCropper) { window.editCropper.destroy(); window.editCropper = null; }
          cropImg.onload = function() {
            window.editCropper = new Cropper(cropImg, {
              aspectRatio: 1,
              viewMode: 1,
              autoCropArea: 1,
              background: false,
              movable: true,
              zoomable: true,
              rotatable: false,
              scalable: false,
              responsive: true,
              dragMode: 'move',
              guides: true,
              highlight: true,
              cropBoxResizable: true,
              cropBoxMovable: true,
              minCropBoxWidth: 100,
              minCropBoxHeight: 100
            });
          };
        }
      };
      reader.readAsDataURL(file);
    };
  }

  // Crop card close (cross button)
  const closeCropBtn = document.getElementById('editCloseCropBtn');
  if (closeCropBtn) {
    closeCropBtn.onclick = function() {
      const cropCard = document.getElementById('editCropCard');
      if (cropCard) cropCard.style.display = 'none';
      if (window.editCropper) { window.editCropper.destroy(); window.editCropper = null; }
    };
  }

  // Crop card save (Save Image button)
  const saveCropBtn = document.getElementById('editSaveCropBtn');
  if (saveCropBtn) {
    saveCropBtn.onclick = function() {
      if (window.editCropper) {
        const canvas = window.editCropper.getCroppedCanvas({ width: 160, height: 160, imageSmoothingQuality: 'high' });
        const avatarIcon = document.getElementById('editPersonAvatarIcon');
        if (avatarIcon) {
          avatarIcon.src = canvas.toDataURL('image/png');
          avatarIcon.style.filter = 'none';
        }
        const cropCard = document.getElementById('editCropCard');
        if (cropCard) cropCard.style.display = 'none';
        window.editCropper.destroy();
        window.editCropper = null;
      }
    };
  }

  // Role dropdown for editable card
  const roleInput = document.getElementById('editPersonRoleInput');
  const roleDropdown = document.getElementById('editPersonRoleDropdown');
  const roleSelected = document.getElementById('editPersonRoleSelected');
  const rollField = document.getElementById('editRollNumberField');
  let roleOpen = false;
  if (roleInput && roleDropdown && roleSelected) {
    roleInput.onclick = function(e) {
      e.stopPropagation();
      roleOpen = !roleOpen;
      roleDropdown.style.display = roleOpen ? 'block' : 'none';
      roleInput.style.borderColor = roleOpen ? '#007bff' : '#e9ecef';
    };
    document.addEventListener('click', function docRoleClose() {
      roleDropdown.style.display = 'none';
      roleInput.style.borderColor = '#e9ecef';
      roleOpen = false;
      document.removeEventListener('click', docRoleClose);
    });
    Array.from(roleDropdown.getElementsByClassName('edit-dropdown-option')).forEach(function(option) {
      option.onmouseenter = function() {
        this.style.background = '#007bff';
        this.style.color = '#fff';
      };
      option.onmouseleave = function() {
        this.style.background = '#fff';
        this.style.color = '#222';
      };
      option.onclick = function(e) {
        e.stopPropagation();
        const selectedRole = this.getAttribute('data-role');
        roleSelected.textContent = selectedRole;
        roleDropdown.style.display = 'none';
        roleInput.style.borderColor = '#e9ecef';
        roleOpen = false;
        // Show/hide roll number field based on role
        if (rollField) {
          const roleLower = selectedRole.toLowerCase();
          if (roleLower === 'phd researcher' || roleLower === 'student' || roleLower === 'm.tech student') {
            rollField.style.display = 'flex';
          } else {
            rollField.style.display = 'none';
          }
        }
      };
    });
  }
}
// ... existing code ...

const imageInput = document.getElementById('editPersonImageInput');
if (imageInput) {
  imageInput.onchange = function() {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      // Show the crop card
      const cropCard = document.getElementById('editCropCard');
      if (cropCard) {
        cropCard.style.display = 'block';
        // Set the image preview
        const cropImg = document.getElementById('editCropImagePreview');
        if (cropImg) cropImg.src = e.target.result;
      }
      // You can initialize your cropper here if needed
      // Example: new Cropper(cropImg, { ... });
    };
    reader.readAsDataURL(file);
  };
}

// Save cropped image
const saveCropBtn = document.getElementById('editSaveCropBtn');
if (saveCropBtn) {
  saveCropBtn.onclick = function() {
    if (editCropper) {
      const canvas = editCropper.getCroppedCanvas({
        width: 160,
        height: 160,
        imageSmoothingQuality: 'high'
      });
      const avatarIcon = document.getElementById('editPersonAvatarIcon');
      if (avatarIcon) {
        avatarIcon.src = canvas.toDataURL('image/png');
      }
      // Hide crop card
      document.getElementById('editCropCard').style.display = 'none';
      editCropper.destroy();
      editCropper = null;
    }
  };
}

// Close crop card without saving
const closeCropBtn = document.getElementById('editCloseCropBtn');
if (closeCropBtn) {
  closeCropBtn.onclick = function() {
    document.getElementById('editCropCard').style.display = 'none';
    if (editCropper) {
      editCropper.destroy();
      editCropper = null;
    }
  };
}
/**
 * Creates a social link row for the edit modal, with the correct platform selected.
 * @param {string} platform - The platform name (e.g., "LinkedIn")
 * @param {string} url - The URL for the social link
 * @returns {HTMLElement} The row element
 */
function createEditSocialLinkRow(platform, url) {
  var row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '0.7em';
  row.style.marginBottom = '0.7em';

  // Platform select
  var selectBox = document.createElement('div');
  selectBox.tabIndex = 0;
  selectBox.style.width = '160px';
  selectBox.style.height = '38px';
  selectBox.style.background = '#f8f9fa';
  selectBox.style.border = '2px solid #e9ecef';
  selectBox.style.borderRadius = '8px';
  selectBox.style.display = 'flex';
  selectBox.style.alignItems = 'center';
  selectBox.style.padding = '0 1em';
  selectBox.style.position = 'relative';
  selectBox.style.cursor = 'pointer';
  selectBox.style.fontSize = '1rem';
  selectBox.style.color = '#222';
  selectBox.style.userSelect = 'none';

  var selectText = document.createElement('span');
  selectText.textContent = platform || 'Select Platform'; // <-- Set to saved value
  selectText.style.flex = '1';
  var arrow = document.createElement('span');
  arrow.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  arrow.style.marginLeft = 'auto';
  selectBox.appendChild(selectText);
  selectBox.appendChild(arrow);

  // Dropdown
  var dropdown = document.createElement('div');
  dropdown.style.display = 'none';
  dropdown.style.position = 'absolute';
  dropdown.style.left = '0';
  dropdown.style.top = '110%';
  dropdown.style.zIndex = '10';
  dropdown.style.background = '#fff';
  dropdown.style.borderRadius = '10px';
  dropdown.style.boxShadow = '0 4px 16px rgba(0,0,0,0.13)';
  dropdown.style.minWidth = '100%';
  dropdown.style.overflow = 'hidden';
  dropdown.style.border = '1.5px solid #007bff';

  var platforms = [
    'Google Scholar', 'ORCID', 'LinkedIn', 'Twitter', 'Github', 'Other'
  ];
  platforms.forEach(function(p) {
    var opt = document.createElement('div');
    opt.className = 'platform-option';
    opt.textContent = p;
    opt.style.padding = '0.7em 1.2em';
    opt.style.fontSize = '1rem';
    opt.style.color = '#222';
    opt.style.cursor = 'pointer';
    opt.style.transition = 'background 0.2s';
    opt.style.textAlign = 'left';
    opt.onmouseenter = function() {
      this.style.background = '#007bff';
      this.style.color = '#fff';
    };
    opt.onmouseleave = function() {
      this.style.background = '#fff';
      this.style.color = '#222';
    };
    opt.onclick = function(e) {
      e.stopPropagation();
      selectText.textContent = p;
      dropdown.style.display = 'none';
      selectBox.style.borderColor = '#e9ecef';
    };
    dropdown.appendChild(opt);
  });
  selectBox.appendChild(dropdown);
  selectBox.onclick = function(e) {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    selectBox.style.borderColor = dropdown.style.display === 'block' ? '#007bff' : '#e9ecef';
  };
  document.addEventListener('click', function() {
    dropdown.style.display = 'none';
    selectBox.style.borderColor = '#e9ecef';
  });

  // URL input
  var urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.placeholder = 'Enter URL';
  urlInput.style.width = '220px';
  urlInput.style.height = '38px';
  urlInput.style.fontSize = '1rem';
  urlInput.style.color = '#222';
  urlInput.style.background = '#f8f9fa';
  urlInput.style.border = '2px solid #e9ecef';
  urlInput.style.borderRadius = '8px';
  urlInput.style.padding = '0.4em 1em';
  urlInput.style.outline = 'none';
  urlInput.style.transition = 'border-color 0.3s';
  urlInput.style.boxSizing = 'border-box';
  urlInput.value = url || '';
  urlInput.onfocus = function() { urlInput.style.borderColor = '#007bff'; };
  urlInput.onblur = function() { urlInput.style.borderColor = '#e9ecef'; };

  // Delete icon
  var del = document.createElement('span');
  del.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  del.style.marginLeft = '1.2em';
  del.style.cursor = 'pointer';
  del.onclick = function() { row.remove(); };

  row.appendChild(selectBox);
  row.appendChild(urlInput);
  row.appendChild(del);
  return row;
}

// Usage example when opening the edit modal:
function populateEditModal(person) {
  // ...populate other fields...
  const socialLinks = person.socialLinks; // [{ platform: "LinkedIn", url: "..." }, ...]
  const container = document.getElementById('editSocialLinksContainer');
  container.innerHTML = '';
  socialLinks.forEach(link => {
    const row = createEditSocialLinkRow(link.platform, link.url);
    container.appendChild(row);
  });
}

// ... existing code ...

// ... existing code ...

// ... existing code ...

// For Add New Person card
(function() {
  var checkbox = document.getElementById('showInPeopleCheckbox');
  if (checkbox) {
    checkbox.addEventListener('click', function() {
      e.stopPropagation();
      checkbox.classList.toggle('checked');
    });
  }
})();

// For Edit Person modal
(function() {
  var checkbox = document.getElementById('editShowInPeopleCheckbox');
  if (checkbox) {
    checkbox.addEventListener('click', function() {
      e.stopPropagation();
      editCheckbox.classList.toggle('checked');
    });
  }
})();

// Make "Show in People Page" box clickable for Add New Person card
document.addEventListener('DOMContentLoaded', function() {
  var showInPeopleCheckbox = document.getElementById('showInPeopleCheckbox');
  if (showInPeopleCheckbox) {
    showInPeopleCheckbox.addEventListener('click', function(e) {
      e.stopPropagation();
      showInPeopleCheckbox.classList.toggle('checked');
    });
  }

  // Make "Show in People Page" box clickable for Edit Person modal
  var editShowInPeopleCheckbox = document.getElementById('editShowInPeopleCheckbox');
  if (editShowInPeopleCheckbox) {
    editShowInPeopleCheckbox.addEventListener('click', function(e) {
      e.stopPropagation();
      editShowInPeopleCheckbox.classList.toggle('checked');
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Add New Person card
  var showInPeopleCheckbox = document.getElementById('showInPeopleCheckbox');
  if (showInPeopleCheckbox) {
    showInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      showInPeopleCheckbox.classList.toggle('checked');
    });
  }

  // Edit Person modal
  var editShowInPeopleCheckbox = document.getElementById('editShowInPeopleCheckbox');
  if (editShowInPeopleCheckbox) {
    editShowInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      editShowInPeopleCheckbox.classList.toggle('checked');
    });
  }
});

function openEditPersonModal() {
  // ... your code to show the modal ...

  // Now attach the event listener
  var editShowInPeopleCheckbox = document.getElementById('editShowInPeopleCheckbox');
  if (editShowInPeopleCheckbox) {
    editShowInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      editShowInPeopleCheckbox.classList.toggle('checked');
    });
  }
}

// For Add New Person card (always present in DOM)
document.addEventListener('DOMContentLoaded', function() {
  var showInPeopleCheckbox = document.getElementById('showInPeopleCheckbox');
  if (showInPeopleCheckbox) {
    showInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      showInPeopleCheckbox.classList.toggle('checked');
    });
  }
});

// For Edit Person modal (may be hidden or shown dynamically)
function enableEditShowInPeopleCheckbox() {
  var editShowInPeopleCheckbox = document.getElementById('editShowInPeopleCheckbox');
  if (editShowInPeopleCheckbox && !editShowInPeopleCheckbox.hasAttribute('data-listener')) {
    editShowInPeopleCheckbox.setAttribute('data-listener', 'true');
    editShowInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      editShowInPeopleCheckbox.classList.toggle('checked');
    });
  }
}

// Call this function every time you open/show the Edit Person modal:
document.addEventListener('DOMContentLoaded', function() {
  // If you show the modal by setting style/display, call this after showing:
  var editBtn = document.getElementById('editSaurabhKumarBtn');
  if (editBtn) {
    editBtn.addEventListener('click', function() {
      // Show the modal (your existing code does this)
      document.getElementById('editPersonModal').style.display = 'flex';
      // Enable the checkbox click
      enableEditShowInPeopleCheckbox();
    });
  }
  // If you have other ways to open the modal, call enableEditShowInPeopleCheckbox() after showing it.
});

// Add at the end of your JS file
document.addEventListener('DOMContentLoaded', function() {
  // Add New Person card
  var showInPeopleCheckbox = document.getElementById('showInPeopleCheckbox');
  if (showInPeopleCheckbox) {
    showInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      showInPeopleCheckbox.classList.toggle('checked');
    });
  }

  // Edit Person modal
  var editShowInPeopleCheckbox = document.getElementById('editShowInPeopleCheckbox');
  if (editShowInPeopleCheckbox) {
    editShowInPeopleCheckbox.addEventListener('click', function(e) {
      e.preventDefault();
      editShowInPeopleCheckbox.classList.toggle('checked');
    });
  }
});

// ... existing code ...

// Find the function that renders the "Add New Person" modal/card.
// Let's assume it's called openEditPersonModal or similar.
// We'll add the custom checkbox HTML and handle its state.

// --- 1. Add the custom checkbox in the Add New Person modal ---

function openAddPersonModal() {
  // ... existing code to create modal ...
  const modal = document.createElement('div');
  modal.id = 'addPersonModal';
  modal.className = 'modal';

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="closeAddPersonModal">&times;</span>
      <h2>Add New Person</h2>
      <label for="addPersonNameInput">Name</label>
      <input type="text" id="addPersonNameInput" class="input" />
      <div class="show-in-people-row" style="margin-top:10px;">
        <label for="addShowInPeopleCheckbox" class="custom-checkbox-label">
          <input type="checkbox" id="addShowInPeopleCheckbox" style="display:none;">
          <span class="custom-checkbox"></span>
          Show in People Page
        </label>
      </div>
      <!-- ... other fields ... -->
      <button id="saveAddPersonBtn" class="btn">Save</button>
    </div>
  `;
  document.body.appendChild(modal);

  // ... existing code to handle modal open/close ...

  // Save handler
  document.getElementById('saveAddPersonBtn').onclick = function() {
    const name = document.getElementById('addPersonNameInput').value;
    // ... get other fields ...
    const showInPeople = document.getElementById('addShowInPeopleCheckbox').checked;
    // ... create person object ...
    const newPerson = {
      name,
      // ... other fields ...,
      showInPeople
    };
    // ... save logic ...
    // For example:
    let people = loadPeopleData();
    people.push(newPerson);
    savePeopleData(people);
    renderAllPeopleCards();
    modal.remove();
  };
}

// --- 2. Add the CSS for the custom checkbox ---

// Add this to your CSS file (public/admin.css), but for demonstration, you can inject it via JS:
const style = document.createElement('style');
style.innerHTML = `
.custom-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  margin-top: 10px;
}
.custom-checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #007bff;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
  position: relative;
  background: #fff;
  transition: background 0.2s, border-color 0.2s;
}
.custom-checkbox-label input:checked + .custom-checkbox {
  background: #007bff;
  border-color: #007bff;
}
.custom-checkbox::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid #fff;
  border-width: 0 3px 3px 0;
  opacity: 0;
  transform: scale(0.8) rotate(45deg);
  transition: opacity 0.2s;
}
.custom-checkbox-label input:checked + .custom-checkbox::after {
  opacity: 1;
}
`;
document.head.appendChild(style);

// ... existing code ...

// List of roles that require roll number
const rolesWithRollNumber = [
  "PhD Researcher",
  "M.Tech Student",
  "Student"
];

// Function to show/hide roll number field
function updateEditRollNumberField() {
  const role = document.getElementById('editPersonRoleSelected').textContent.trim();
  const rollField = document.getElementById('editRollNumberField');
  if (rolesWithRollNumber.includes(role)) {
    rollField.style.display = '';
  } else {
    rollField.style.display = 'none';
  }
}

// Attach event listener to role box (dropdown)
document.getElementById('editPersonRoleSelected').addEventListener('click', function() {
  // If your dropdown opens a list, you may need to listen for selection instead.
  // If you have a custom dropdown, listen for the selection event:
  // For example, if you have a function that sets the role, call updateEditRollNumberField() there.
  setTimeout(updateEditRollNumberField, 100); // Delay to allow selection to update
});

// Also call once when opening the modal to set initial state
updateEditRollNumberField();

// ... existing code ...

// ... existing code ...

// Show/hide Roll Number field in Add New Person card based on role
(function() {
  const rolesWithRollNumber = [
    'PhD Researcher',
    'M.Tech. Researcher',
    'Student'
  ];
  function updateAddPersonRollNumberField() {
    const role = document.getElementById('personRoleSelected')?.textContent.trim();
    const rollField = document.getElementById('addPersonRollNumberField');
    if (!rollField) return;
    if (rolesWithRollNumber.includes(role)) {
      rollField.style.display = '';
    } else {
      rollField.style.display = 'none';
    }
  }
  // Attach to role dropdown selection logic
  const roleInput = document.getElementById('personRoleInput');
  if (roleInput) {
    roleInput.addEventListener('click', function() {
      setTimeout(updateAddPersonRollNumberField, 100);
    });
  }
  // Call once on page load to set initial state
  document.addEventListener('DOMContentLoaded', updateAddPersonRollNumberField);
})();
// ... existing code ...