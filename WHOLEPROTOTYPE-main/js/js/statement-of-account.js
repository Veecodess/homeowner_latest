const dues = {
  unpaid: [
    { date: '2026-05-10', description: 'June 2025 Dues', dueDate: '05/31/2025', amount: 1500, overdue: false },
    { date: '2026-05-10', description: 'June 2025 Dues', dueDate: '05/31/2025', amount: 1500, overdue: false },
    { date: '2026-05-10', description: 'June 2025 Dues', dueDate: '05/31/2025', amount: 1500, overdue: true }
  ],
  paid: [
    { date: '2026-05-10', description: 'June 2025 Dues', dueDate: '05/31/2025', amount: 1500 },
    { date: '2026-05-10', description: 'June 2025 Dues', dueDate: '05/31/2025', amount: 1500 },
    { date: '2026-05-10', description: 'June 2025 Dues', dueDate: '05/31/2025', amount: 1500 }
  ]
};

const duesRows = document.getElementById('duesRows');
const duesEmpty = document.getElementById('duesEmpty');
const duesTabs = document.querySelectorAll('.dues-tab');
const duesPanel = document.getElementById('duesPanel');
const soaDialog = document.getElementById('soaDialog');
const soaDialogTitle = document.getElementById('soaDialogTitle');
const soaDialogContent = document.getElementById('soaDialogContent');
const soaInspectionDialog = document.getElementById('soaInspectionDialog');
const paymentDialog = document.getElementById('paymentDialog');
const paymentOptions = document.querySelectorAll('.payment-option');
let selectedStatus = 'paid';

const formatAmount = (amount) => `₱${amount.toLocaleString('en-PH')}`;

const appendDialogRow = (label, value) => {
  const row = document.createElement('div');
  row.className = 'soa-dialog-row';
  const labelElement = document.createElement('span');
  labelElement.textContent = label;
  const valueElement = document.createElement('strong');
  valueElement.textContent = value;
  row.append(labelElement, valueElement);
  soaDialogContent.appendChild(row);
};

const openPaymentDialog = (payment) => {
  soaDialogTitle.textContent = payment.description;
  soaDialogContent.replaceChildren();
  appendDialogRow('Status', 'Paid');
  appendDialogRow('Date', payment.date);
  appendDialogRow('Due date', payment.dueDate);
  appendDialogRow('Amount', formatAmount(payment.amount));
  soaDialog.showModal();
};

const createEyeIcon = () => {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('aria-hidden', 'true');
  const eye = document.createElementNS(svgNamespace, 'path');
  eye.setAttribute('d', 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z');
  const pupil = document.createElementNS(svgNamespace, 'circle');
  pupil.setAttribute('cx', '12');
  pupil.setAttribute('cy', '12');
  pupil.setAttribute('r', '3');
  svg.append(eye, pupil);
  return svg;
};

const renderDues = () => {
  const entries = dues[selectedStatus];
  duesRows.replaceChildren();
  duesEmpty.hidden = entries.length > 0;
  duesEmpty.textContent = `No ${selectedStatus} dues to display.`;

  entries.forEach((payment) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    dateCell.textContent = payment.date;
    const descriptionCell = document.createElement('td');
    const description = document.createElement('span');
    description.className = 'dues-description';
    const descriptionTitle = document.createElement('span');
    descriptionTitle.textContent = payment.description;
    const dueDate = document.createElement('small');
    dueDate.textContent = `Due date: ${payment.dueDate}`;
    description.append(descriptionTitle, dueDate);
    descriptionCell.appendChild(description);
    const amountCell = document.createElement('td');
    amountCell.textContent = formatAmount(payment.amount);
    const actionCell = document.createElement('td');
    if (selectedStatus === 'paid') {
      const viewButton = document.createElement('button');
      viewButton.className = 'due-view-button';
      viewButton.type = 'button';
      viewButton.setAttribute('aria-label', `View ${payment.description} details`);
      viewButton.appendChild(createEyeIcon());
      viewButton.addEventListener('click', () => openPaymentDialog(payment));
      actionCell.appendChild(viewButton);
    } else if (payment.overdue) {
      const overdueLabel = document.createElement('button');
      overdueLabel.className = 'overdue-badge';
      overdueLabel.type = 'button';
      overdueLabel.textContent = 'Overdue';
      overdueLabel.setAttribute('aria-label', `View payment options for overdue ${payment.description}`);
      overdueLabel.addEventListener('click', openPaymentOptions);
      actionCell.appendChild(overdueLabel);
    } else {
      const payButton = document.createElement('button');
      payButton.className = 'pay-button';
      payButton.type = 'button';
      payButton.textContent = 'Pay';
      payButton.setAttribute('aria-label', `Pay ${payment.description}`);
      payButton.addEventListener('click', openPaymentOptions);
      actionCell.appendChild(payButton);
    }
    row.append(dateCell, descriptionCell, amountCell, actionCell);
    duesRows.appendChild(row);
  });
};

duesTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    selectedStatus = tab.dataset.status;
    duesTabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    duesPanel.setAttribute('aria-labelledby', tab.id);
    renderDues();
  });
});

const openInspectionDialog = () => soaInspectionDialog.showModal();
const openPaymentOptions = () => {
  paymentOptions.forEach((option, index) => {
    const selected = index === 0;
    option.setAttribute('aria-pressed', String(selected));
    option.classList.toggle('payment-option-selected', selected);
  });
  paymentDialog.showModal();
};

document.getElementById('soaOpenButton').addEventListener('click', openInspectionDialog);
document.getElementById('breakdownButton').addEventListener('click', openInspectionDialog);
document.getElementById('printSoaButton').addEventListener('click', () => window.print());
paymentOptions.forEach((option) => {
  option.addEventListener('click', () => {
    paymentOptions.forEach((item) => {
      const selected = item === option;
      item.setAttribute('aria-pressed', String(selected));
      item.classList.toggle('payment-option-selected', selected);
    });
  });
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('logoutDialog').showModal();
});
document.getElementById('confirmLogout').addEventListener('click', () => {
  window.location.assign(new URL('Login.html', window.location.href).href);
});

renderDues();
