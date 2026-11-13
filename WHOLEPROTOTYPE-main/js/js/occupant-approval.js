document.addEventListener('DOMContentLoaded', () => {
  const pendingButton = document.getElementById('pending-btn');
  const historyButton = document.getElementById('history-btn');
  const pendingHeader = document.getElementById('pending-approval-header');
  const historyHeader = document.getElementById('history-approval-header');
  const tableBody = document.getElementById('occupant-table-body');
  const message = document.getElementById('approval-message');
  const requestsKey = 'casa-milan-family-member-approval-requests';
  const homeownersKey = 'casa-milan-homeowners';
  let activeTab = 'pending';

  const readList = (key) => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(saved)) throw new TypeError(`${key} must contain a list.`);
      return saved;
    } catch (error) {
      console.error(`Unable to read ${key}.`, error);
      message.textContent = 'Unable to load family member requests.';
      return null;
    }
  };

  const writeList = (key, records) => {
    localStorage.setItem(key, JSON.stringify(records));
  };

  const fullName = (record) => (
    [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ').trim() || 'Family Member'
  );

  const requestKey = (request) => [
    request.blockNo || '',
    request.lotNo || '',
    request.parentEmail || '',
    request.firstName || '',
    request.middleName || '',
    request.lastName || '',
    request.email || '',
    request.createdAt || ''
  ].join('|');

  const appendCell = (row, value) => {
    const cell = document.createElement('td');
    cell.textContent = value || '—';
    row.appendChild(cell);
  };

  const createActionButton = (label, className, handler) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  };

  const render = () => {
    message.textContent = '';
    tableBody.replaceChildren();
    const requests = readList(requestsKey);
    if (!requests) return;

    const visibleRequests = requests.filter((request) => (
      request.role === 'Family Member' &&
      (activeTab === 'pending' ? request.status === 'Pending' : request.status !== 'Pending')
    ));

    if (!visibleRequests.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = activeTab === 'pending' ? 7 : 7;
      cell.textContent = activeTab === 'pending'
        ? 'No family member requests are waiting for approval.'
        : 'No reviewed family member requests yet.';
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    visibleRequests.forEach((request, index) => {
      const row = document.createElement('tr');
      const checkboxCell = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('aria-label', `Select ${fullName(request)}`);
      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);
      appendCell(row, String(index + 1));
      appendCell(row, fullName(request));
      appendCell(row, request.relationship);
      appendCell(row, [request.parentFirstName, request.parentMiddleName, request.parentLastName].filter(Boolean).join(' '));
      appendCell(row, request.address || `Block ${request.blockNo || '—'} Lot ${request.lotNo || '—'}`);

      const actionCell = document.createElement('td');
      if (activeTab === 'pending') {
        actionCell.append(
          createActionButton('Approve', 'approval-action approval-approve', () => updateRequest(request, 'Approved')),
          createActionButton('Reject', 'approval-action approval-reject', () => updateRequest(request, 'Rejected'))
        );
      } else {
        actionCell.textContent = request.status || 'Reviewed';
      }
      row.appendChild(actionCell);
      tableBody.appendChild(row);
    });
  };

  const updateRequest = (selectedRequest, nextStatus) => {
    const requests = readList(requestsKey);
    if (!requests) return;
    const requestIndex = requests.findIndex((request) => requestKey(request) === requestKey(selectedRequest));
    if (requestIndex === -1) {
      render();
      message.textContent = 'This request is no longer available. Refresh the list and try again.';
      return;
    }

    const request = requests[requestIndex];
    if (nextStatus === 'Approved') {
      const homeowners = readList(homeownersKey);
      if (!homeowners) return;
      const homeownerIndex = homeowners.findIndex((homeowner) => {
        const sameUnit =
          String(homeowner.blockNo || '') === String(request.blockNo || '') &&
          String(homeowner.lotNo || '') === String(request.lotNo || '');
        if (request.blockNo || request.lotNo) return sameUnit;
        return String(homeowner.email || '').trim().toLowerCase() === String(request.parentEmail || '').trim().toLowerCase();
      });
      if (homeownerIndex === -1) {
        message.textContent = 'The primary resident record for this request could not be found.';
        return;
      }

      const homeowner = homeowners[homeownerIndex];
      const familyMembers = Array.isArray(homeowner.familyMembers) ? [...homeowner.familyMembers] : [];
      const duplicate = familyMembers.some((member) => (
        (request.email && String(member.email || '').trim().toLowerCase() === String(request.email).trim().toLowerCase()) ||
        fullName(member).toLowerCase() === fullName(request).toLowerCase()
      ));
      if (!duplicate) {
        familyMembers.push({
          firstName: request.firstName || '',
          middleName: request.middleName || '',
          lastName: request.lastName || '',
          relationship: request.relationship || '',
          gender: request.gender || '',
          ownershipStatus: request.ownershipStatus || '',
          contactNumber: request.contactNumber || '',
          email: request.email || '',
          createdAt: request.createdAt || new Date().toISOString()
        });
        homeowners[homeownerIndex] = { ...homeowner, familyMembers };
        try {
          writeList(homeownersKey, homeowners);
        } catch (error) {
          console.error('Unable to add approved family member to the homeowner record.', error);
          message.textContent = 'Unable to approve this request. Please try again.';
          return;
        }
      }
    }

    request.status = nextStatus;
    request.approvalStatus = nextStatus;
    request.reviewedAt = new Date().toISOString();
    try {
      writeList(requestsKey, requests);
    } catch (error) {
      console.error('Unable to update family member request status.', error);
      message.textContent = 'Unable to update this request. Please try again.';
      return;
    }
    message.textContent = `Family member request ${nextStatus.toLowerCase()}.`;
    render();
  };

  const setActiveTab = (tab) => {
    activeTab = tab;
    const isPending = tab === 'pending';
    pendingButton.classList.toggle('active', isPending);
    historyButton.classList.toggle('active', !isPending);
    pendingHeader.classList.toggle('active', isPending);
    historyHeader.classList.toggle('active', !isPending);
    render();
  };

  pendingButton.addEventListener('click', () => setActiveTab('pending'));
  historyButton.addEventListener('click', () => setActiveTab('history'));
  setActiveTab('pending');
});
