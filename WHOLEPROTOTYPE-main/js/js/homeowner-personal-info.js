(() => {
  const homeownersKey = 'casa-milan-homeowners';
  const pendingKey = 'casa-milan-family-member-approval-requests';
  const currentUserEmailKey = 'casa-milan-current-user-email';
  const profileDialog = document.getElementById('profileDialog');
  const personalInfoButton = document.querySelector('.profile-option');
  const changePasswordButton = [...document.querySelectorAll('.profile-option')]
    .find((button) => button.textContent.includes('Change Password'));

  if (!profileDialog || !personalInfoButton) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'personal-info-dialog';
  dialog.setAttribute('aria-labelledby', 'personalInfoTitle');
  dialog.innerHTML = `
    <header class="personal-info-header">
      <h2 id="personalInfoTitle">Personal Information</h2>
      <button class="personal-info-close" type="button" aria-label="Close personal information">×</button>
    </header>
    <p class="personal-info-message" id="personalInfoMessage" role="status"></p>
    <form id="homeownerProfileForm">
      <section class="personal-info-section">
        <h3>Personal Information</h3>
        <div class="personal-info-fields">
          <label>Name<input name="name" id="personalInfoName" required></label>
          <label>Gender
            <select name="gender" id="personalInfoGender">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </label>
          <label>Contact Number<input name="contactNumber" id="personalInfoContact"></label>
          <label>Email<input type="email" name="email" id="personalInfoEmail" required></label>
          <label>Ownership Status
            <select name="ownershipStatus" id="personalInfoOwnership">
              <option value="">Select ownership status</option>
              <option value="House and Lot Owner">House and Lot Owner</option>
              <option value="House Owner">House Owner</option>
              <option value="Lot Owner">Lot Owner</option>
            </select>
          </label>
        </div>
      </section>

      <section class="personal-info-section">
        <h3>Property Information</h3>
        <div class="personal-info-fields">
          <label class="personal-info-span">Address<input name="address" id="personalInfoAddress"></label>
          <label>Lot Area<input name="lotArea" id="personalInfoLotArea"></label>
          <label>Block Number<input name="blockNo" id="personalInfoBlock"></label>
          <label>Lot Number<input name="lotNo" id="personalInfoLot"></label>
        </div>
      </section>

      <section class="personal-info-section">
        <h3>Vehicle Information</h3>
        <div class="personal-info-table-wrap">
          <table class="personal-info-table">
            <thead><tr><th>Model</th><th>Plate Number</th><th>HOA Sticker</th></tr></thead>
            <tbody id="personalInfoVehicles"></tbody>
          </table>
        </div>
      </section>

      <section class="personal-info-section">
        <div class="personal-info-section-heading">
          <h3>Family Members and Relationships</h3>
          <button class="personal-info-add-member" id="showFamilyRequest" type="button">+ Add Member</button>
        </div>
        <div class="personal-info-table-wrap">
          <table class="personal-info-table">
            <thead><tr><th>Name</th><th>Relationship</th><th>Contact Number</th><th>Email</th><th>Status</th></tr></thead>
            <tbody id="personalInfoFamilyMembers"></tbody>
          </table>
          <p class="personal-info-empty" id="personalInfoNoFamily" hidden>No family members have been added.</p>
        </div>
      </section>

      <div class="personal-info-actions">
        <button class="personal-info-cancel" id="cancelPersonalInfo" type="button">Cancel</button>
        <button class="personal-info-save" type="submit">Save Changes</button>
      </div>
    </form>

    <form class="family-request-panel personal-info-section" id="familyMemberRequestForm" hidden>
      <h3>New Family Member</h3>
      <div class="personal-info-fields">
        <label class="personal-info-span">Name<input name="name" required></label>
        <label>Gender
          <select name="gender">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
        <label>Contact Number<input name="contactNumber"></label>
        <label>Email<input type="email" name="email"></label>
        <label>Ownership Status
          <select name="ownershipStatus">
            <option value="">Select ownership status</option>
            <option value="House and Lot Owner">House and Lot Owner</option>
            <option value="House Owner">House Owner</option>
            <option value="Lot Owner">Lot Owner</option>
          </select>
        </label>
        <label>Relationship<input name="relationship" required></label>
      </div>
      <div class="personal-info-linked-property">
        <h4>Linked Property</h4>
        <p id="familyRequestProperty"></p>
      </div>
      <p class="personal-info-message" id="familyRequestMessage" role="status"></p>
      <div class="personal-info-actions">
        <button class="personal-info-cancel" id="cancelFamilyRequest" type="button">Cancel</button>
        <button class="personal-info-save" type="submit">Submit for Approval</button>
      </div>
    </form>
  `;
  document.body.appendChild(dialog);

  if (changePasswordButton) {
    const changePasswordDialog = document.createElement('dialog');
    changePasswordDialog.className = 'change-password-dialog';
    changePasswordDialog.setAttribute('aria-labelledby', 'changePasswordTitle');
    changePasswordDialog.innerHTML = `
      <button class="change-password-close" type="button" aria-label="Close change password">×</button>
      <h2 id="changePasswordTitle">Change Password</h2>
      <form id="changePasswordForm">
        <label class="change-password-field">
          Current Password
          <span class="change-password-input-wrap">
            <input name="currentPassword" type="password" autocomplete="current-password" required>
            <button type="button" class="password-visibility-toggle" aria-label="Show current password">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>
            </button>
          </span>
        </label>
        <label class="change-password-field">
          New Password
          <span class="change-password-input-wrap">
            <input name="newPassword" type="password" autocomplete="new-password" required>
            <button type="button" class="password-visibility-toggle" aria-label="Show new password">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>
            </button>
          </span>
        </label>
        <label class="change-password-field">
          Confirm Password
          <span class="change-password-input-wrap">
            <input name="confirmPassword" type="password" autocomplete="new-password" required>
            <button type="button" class="password-visibility-toggle" aria-label="Show confirm password">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>
            </button>
          </span>
        </label>
        <button class="change-password-save" type="submit">Save</button>
        <p class="change-password-message" id="changePasswordMessage" role="status"></p>
      </form>
    `;
    document.body.appendChild(changePasswordDialog);

    const changePasswordForm = changePasswordDialog.querySelector('#changePasswordForm');
    const changePasswordMessage = changePasswordDialog.querySelector('#changePasswordMessage');

    changePasswordButton.addEventListener('click', () => {
      profileDialog.close();
      changePasswordMessage.textContent = '';
      changePasswordMessage.classList.remove('is-error');
      changePasswordForm.reset();
      changePasswordDialog.showModal();
      changePasswordForm.elements.currentPassword.focus();
    });

    changePasswordDialog.querySelector('.change-password-close').addEventListener('click', () => {
      changePasswordDialog.close();
    });

    changePasswordDialog.querySelectorAll('.password-visibility-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const input = toggle.parentElement.querySelector('input');
        const showPassword = input.type === 'password';
        input.type = showPassword ? 'text' : 'password';
        toggle.setAttribute('aria-label', `${showPassword ? 'Hide' : 'Show'} ${input.name.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      });
    });

    changePasswordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const newPassword = changePasswordForm.elements.newPassword.value;
      const confirmPassword = changePasswordForm.elements.confirmPassword.value;
      if (newPassword !== confirmPassword) {
        changePasswordMessage.textContent = 'New password and confirmation do not match.';
        changePasswordMessage.classList.add('is-error');
        return;
      }

      changePasswordMessage.classList.remove('is-error');
      changePasswordMessage.textContent = 'Password changes are not connected in this prototype.';
    });
  }

  const profileForm = dialog.querySelector('#homeownerProfileForm');
  const familyRequestForm = dialog.querySelector('#familyMemberRequestForm');
  const profileMessage = dialog.querySelector('#personalInfoMessage');
  const familyRequestMessage = dialog.querySelector('#familyRequestMessage');
  const profileNameInput = dialog.querySelector('#personalInfoName');
  let currentHomeowner = null;
  let homeownerIdentity = null;

  const readList = (key) => {
    const raw = localStorage.getItem(key);
    if (raw === null) return [];
    const records = JSON.parse(raw);
    if (!Array.isArray(records)) throw new TypeError(`${key} must contain a list.`);
    return records;
  };

  const writeList = (key, records) => {
    localStorage.setItem(key, JSON.stringify(records));
  };

  const getFullName = (record) => (
    [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ').trim()
  );

  const splitName = (value) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] || '',
      middleName: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
      lastName: parts.length > 1 ? parts[parts.length - 1] : ''
    };
  };

  const setDisabled = (disabled) => {
    dialog.querySelectorAll('input, select, form button[type="submit"], .personal-info-add-member')
      .forEach((control) => {
        control.disabled = disabled;
      });
  };

  const showError = (error, message) => {
    console.error(message, error);
    profileMessage.textContent = message;
    profileMessage.classList.add('is-error');
  };

  const isSameHomeowner = (candidate, identity) => (
    String(candidate.blockNo || '') === identity.blockNo &&
    String(candidate.lotNo || '') === identity.lotNo &&
    String(candidate.email || '').trim().toLowerCase() === identity.email &&
    String(candidate.firstName || '') === identity.firstName &&
    String(candidate.middleName || '') === identity.middleName &&
    String(candidate.lastName || '') === identity.lastName
  );

  const getCurrentHomeowner = () => {
    const homeowners = readList(homeownersKey);
    const currentEmail = sessionStorage.getItem(currentUserEmailKey)?.trim().toLowerCase() || '';
    if (currentEmail) {
      return homeowners.find((homeowner) => (
        String(homeowner.email || '').trim().toLowerCase() === currentEmail
      )) || null;
    }
    return homeowners.length === 1 ? homeowners[0] : null;
  };

  const appendCell = (row, value) => {
    const cell = document.createElement('td');
    cell.textContent = value || '—';
    row.appendChild(cell);
  };

  const renderVehicles = (homeowner) => {
    const body = dialog.querySelector('#personalInfoVehicles');
    body.replaceChildren();
    const vehicles = Array.isArray(homeowner.vehicles) ? homeowner.vehicles : [];
    if (!vehicles.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 3;
      cell.textContent = 'No vehicles have been added.';
      row.appendChild(cell);
      body.appendChild(row);
      return;
    }
    vehicles.forEach((vehicle) => {
      const row = document.createElement('tr');
      appendCell(row, vehicle.model);
      appendCell(row, vehicle.plateNumber);
      appendCell(row, vehicle.hoaSticker);
      body.appendChild(row);
    });
  };

  const renderFamilyMembers = (homeowner) => {
    const body = dialog.querySelector('#personalInfoFamilyMembers');
    const emptyMessage = dialog.querySelector('#personalInfoNoFamily');
    body.replaceChildren();

    const existingMembers = Array.isArray(homeowner.familyMembers) ? homeowner.familyMembers : [];
    const hasUnit = Boolean(homeowner.blockNo || homeowner.lotNo);
    const pendingMembers = readList(pendingKey).filter((record) => (
      record.role === 'Family Member' &&
      record.status === 'Pending' &&
      (hasUnit
        ? String(record.blockNo || '') === String(homeowner.blockNo || '') &&
          String(record.lotNo || '') === String(homeowner.lotNo || '')
        : String(record.parentEmail || '').trim().toLowerCase() === String(homeowner.email || '').trim().toLowerCase())
    ));

    const rows = [
      ...existingMembers.map((member) => ({ ...member, displayStatus: 'Current' })),
      ...pendingMembers.map((member) => ({ ...member, displayStatus: 'Pending approval' }))
    ];
    emptyMessage.hidden = rows.length > 0;
    rows.forEach((member) => {
      const row = document.createElement('tr');
      appendCell(row, getFullName(member));
      appendCell(row, member.relationship);
      appendCell(row, member.contactNumber);
      appendCell(row, member.email);
      appendCell(row, member.displayStatus);
      body.appendChild(row);
    });
  };

  const populateForm = (homeowner) => {
    currentHomeowner = homeowner;
    homeownerIdentity = {
      blockNo: String(homeowner.blockNo || ''),
      lotNo: String(homeowner.lotNo || ''),
      email: String(homeowner.email || '').trim().toLowerCase(),
      firstName: String(homeowner.firstName || ''),
      middleName: String(homeowner.middleName || ''),
      lastName: String(homeowner.lastName || '')
    };
    profileNameInput.value = getFullName(homeowner);
    dialog.querySelector('#personalInfoGender').value = homeowner.gender || '';
    dialog.querySelector('#personalInfoContact').value = homeowner.contactNumber || '';
    dialog.querySelector('#personalInfoEmail').value = homeowner.email || '';
    dialog.querySelector('#personalInfoOwnership').value = homeowner.ownershipStatus || '';
    dialog.querySelector('#personalInfoAddress').value = homeowner.address || '';
    dialog.querySelector('#personalInfoLotArea').value = homeowner.lotArea || '';
    dialog.querySelector('#personalInfoBlock').value = homeowner.blockNo || '';
    dialog.querySelector('#personalInfoLot').value = homeowner.lotNo || '';
    dialog.querySelector('#familyRequestProperty').textContent = [
      homeowner.address,
      homeowner.blockNo && `Block ${homeowner.blockNo}`,
      homeowner.lotNo && `Lot ${homeowner.lotNo}`
    ].filter(Boolean).join(' · ') || 'No property information is available.';
    renderVehicles(homeowner);
    renderFamilyMembers(homeowner);

    const fullName = getFullName(homeowner);
    const profileName = document.querySelector('.profile-name');
    const profileNameDisplay = profileDialog.querySelector('.profile-name-display');
    if (fullName && profileName) profileName.textContent = fullName;
    if (fullName && profileNameDisplay) profileNameDisplay.textContent = fullName;
    const dashboardHeading = document.querySelector('.dashboard-heading h1');
    if (fullName && dashboardHeading) dashboardHeading.textContent = `Welcome, ${fullName}!`;
  };

  const loadHomeowner = () => {
    profileMessage.classList.remove('is-error');
    profileMessage.textContent = '';
    setDisabled(false);
    try {
      const homeowner = getCurrentHomeowner();
      if (!homeowner) {
        currentHomeowner = null;
        homeownerIdentity = null;
        profileMessage.textContent = 'No homeowner record matches this account. Sign in with the email registered to your homeowner account.';
        setDisabled(true);
        return;
      }
      populateForm(homeowner);
    } catch (error) {
      currentHomeowner = null;
      homeownerIdentity = null;
      showError(error, 'Unable to load your personal information.');
      setDisabled(true);
    }
  };

  personalInfoButton.addEventListener('click', () => {
    profileDialog.close();
    loadHomeowner();
    dialog.showModal();
  });

  dialog.querySelector('.personal-info-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('#cancelPersonalInfo').addEventListener('click', () => dialog.close());

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentHomeowner || !homeownerIdentity) return;

    try {
      const homeowners = readList(homeownersKey);
      const homeownerIndex = homeowners.findIndex((homeowner) => (
        isSameHomeowner(homeowner, homeownerIdentity)
      ));
      if (homeownerIndex === -1) {
        profileMessage.textContent = 'Your homeowner record changed. Close this window and reopen your information before saving.';
        profileMessage.classList.add('is-error');
        return;
      }

      const names = splitName(profileNameInput.value);
      const updatedHomeowner = {
        ...homeowners[homeownerIndex],
        ...names,
        gender: dialog.querySelector('#personalInfoGender').value,
        contactNumber: dialog.querySelector('#personalInfoContact').value.trim(),
        email: dialog.querySelector('#personalInfoEmail').value.trim(),
        ownershipStatus: dialog.querySelector('#personalInfoOwnership').value,
        address: dialog.querySelector('#personalInfoAddress').value.trim(),
        lotArea: dialog.querySelector('#personalInfoLotArea').value.trim(),
        blockNo: dialog.querySelector('#personalInfoBlock').value.trim(),
        lotNo: dialog.querySelector('#personalInfoLot').value.trim()
      };
      homeowners[homeownerIndex] = updatedHomeowner;
      writeList(homeownersKey, homeowners);
      sessionStorage.setItem(currentUserEmailKey, updatedHomeowner.email.trim().toLowerCase());
      populateForm(updatedHomeowner);
      profileMessage.classList.remove('is-error');
      profileMessage.textContent = 'Your information has been saved.';
    } catch (error) {
      showError(error, 'Unable to save your personal information. Please try again.');
    }
  });

  dialog.querySelector('#showFamilyRequest').addEventListener('click', () => {
    familyRequestMessage.textContent = '';
    familyRequestMessage.classList.remove('is-error');
    familyRequestForm.hidden = false;
    familyRequestForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  dialog.querySelector('#cancelFamilyRequest').addEventListener('click', () => {
    familyRequestForm.reset();
    familyRequestMessage.textContent = '';
    familyRequestForm.hidden = true;
  });

  familyRequestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentHomeowner) return;

    const formData = new FormData(familyRequestForm);
    const names = splitName(String(formData.get('name') || ''));
    const relationship = String(formData.get('relationship') || '').trim();
    const memberEmail = String(formData.get('email') || '').trim();
    try {
      const pendingMembers = readList(pendingKey);
      const duplicate = pendingMembers.some((member) => (
        member.role === 'Family Member' &&
        member.status === 'Pending' &&
        String(member.blockNo || '') === String(currentHomeowner.blockNo || '') &&
        String(member.lotNo || '') === String(currentHomeowner.lotNo || '') &&
        (
          (memberEmail && String(member.email || '').trim().toLowerCase() === memberEmail.toLowerCase()) ||
          getFullName(member).toLowerCase() === String(formData.get('name') || '').trim().toLowerCase()
        )
      ));
      if (duplicate) {
        familyRequestMessage.classList.add('is-error');
        familyRequestMessage.textContent = 'A request for this family member is already pending.';
        return;
      }

      pendingMembers.push({
        ...names,
        relationship,
        gender: String(formData.get('gender') || ''),
        contactNumber: String(formData.get('contactNumber') || '').trim(),
        email: memberEmail,
        ownershipStatus: String(formData.get('ownershipStatus') || ''),
        address: currentHomeowner.address || '',
        blockNo: currentHomeowner.blockNo || '',
        lotNo: currentHomeowner.lotNo || '',
        parentFirstName: currentHomeowner.firstName || '',
        parentMiddleName: currentHomeowner.middleName || '',
        parentLastName: currentHomeowner.lastName || '',
        role: 'Family Member',
        status: 'Pending',
        credentialStatus: 'Pending',
        approvalStatus: 'Pending',
        parentEmail: currentHomeowner.email || '',
        createdAt: new Date().toISOString()
      });
      writeList(pendingKey, pendingMembers);
      renderFamilyMembers(currentHomeowner);
      familyRequestForm.reset();
      familyRequestMessage.classList.remove('is-error');
      familyRequestMessage.textContent = 'Your family member request has been submitted for approval.';
    } catch (error) {
      console.error('Unable to submit family member request.', error);
      familyRequestMessage.classList.add('is-error');
      familyRequestMessage.textContent = 'Unable to submit your request. Please try again.';
    }
  });
})();
