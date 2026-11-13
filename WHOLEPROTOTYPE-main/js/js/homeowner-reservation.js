const facilities = [
  {
    name: 'Badminton Court',
    image: 'images/badminton_court.jpg',
    rates: [
      'Taraflex flooring: PHP 300 / hour',
      'Concrete flooring: PHP 150 / hour',
      'Semi-taraflex flooring: PHP 250',
      'Table tennis: PHP 200'
    ]
  },
  {
    name: 'Volleyball Court',
    image: 'images/volleyball_court.jpg',
    rates: ['PHP 1,000 / hour with lights']
  },
  {
    name: 'Basketball Court',
    image: 'images/basketball_court.jpg',
    rates: ['PHP 1,800 / hour with lights']
  },
  {
    name: 'Swimming Pool',
    image: 'images/swimming_pool.jpg',
    rates: ['Pool: PHP 250 / pax', 'With chairs and tables: PHP 500 / pax']
  },
  {
    name: 'Main Hall',
    image: 'images/functionhall.jpg',
    rates: ['PHP 30,000']
  },
  {
    name: 'Pickleball',
    image: 'images/volleyball_court.jpg',
    rates: ['Please contact management for rates']
  }
];

const slots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];
const bookingStorageKey = 'casa-milan-homeowner-bookings';
const facilityPicker = document.getElementById('facilityPicker');
const facilityPhoto = document.getElementById('facilityPhoto');
const facilityName = document.getElementById('facilityName');
const facilityRates = document.getElementById('facilityRates');
const facilityRateBlock = document.getElementById('facilityRateBlock');
const facilityOperationBlock = document.getElementById('facilityOperationBlock');
const facilityPolicyBlock = document.getElementById('facilityPolicyBlock');
const mainHallDetails = document.getElementById('mainHallDetails');
const availabilityTitle = document.getElementById('availability-title');
const bookingControls = document.getElementById('bookingControls');
const bookingDate = document.getElementById('bookingDate');
const timeSlotList = document.getElementById('timeSlotList');
const continueButton = document.getElementById('continueButton');
const bookButton = document.getElementById('bookButton');
const bookingMessage = document.getElementById('bookingMessage');
const bookingList = document.getElementById('bookingList');
const facilityActions = document.getElementById('facilityActions');
const bookingDetailsDialog = document.getElementById('bookingDetailsDialog');
const cancelBookingDialog = document.getElementById('cancelBookingDialog');
const bookingCancelError = document.getElementById('bookingCancelError');
let selectedBooking = null;
const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
const requestedFacilityName = new URLSearchParams(window.location.search).get('facility');
const requestedFacility = facilities.find((facility) => facility.name === requestedFacilityName);
let selectedFacility = requestedFacility || facilities[0];
let selectedTime = '';
let selectedPaymentMethod = '';
let bookingStepOpen = Boolean(requestedFacility && requestedFacility.name !== 'Main Hall');

const getBookings = () => {
  try {
    const savedBookings = JSON.parse(localStorage.getItem(bookingStorageKey) || '[]');
    return Array.isArray(savedBookings) ? savedBookings : [];
  } catch (error) {
    console.error('Unable to read homeowner bookings from local storage.', error);
    return [];
  }
};

const renderFacilities = () => {
  facilities.forEach((facility) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'facility-choice';
    button.textContent = facility.name;
    button.setAttribute('aria-pressed', String(facility === selectedFacility));
    button.addEventListener('click', () => {
      selectedFacility = facility;
      selectedTime = '';
      selectedPaymentMethod = '';
      paymentMethodInputs.forEach((input) => {
        input.checked = false;
      });
      bookingMessage.textContent = '';
      facilityPicker.querySelectorAll('.facility-choice').forEach((choice) => {
        choice.setAttribute('aria-pressed', String(choice.textContent === facility.name));
      });
      renderFacilityDetails();
      if (bookingStepOpen && facility.name !== 'Main Hall') renderTimeSlots();
    });
    facilityPicker.appendChild(button);
  });
};

const renderFacilityDetails = () => {
  const isMainHall = selectedFacility.name === 'Main Hall';
  availabilityTitle.textContent = isMainHall
    ? 'Main Hall Details'
    : '1. Select a Date and Available Time Slots';
  facilityName.hidden = isMainHall;
  facilityName.textContent = selectedFacility.name;
  facilityPhoto.src = selectedFacility.image;
  facilityPhoto.alt = selectedFacility.name;
  facilityPhoto.hidden = isMainHall;
  facilityPhoto.closest('.facility-detail').classList.toggle('main-hall-selected', isMainHall);
  facilityRateBlock.hidden = isMainHall;
  facilityOperationBlock.hidden = isMainHall;
  facilityPolicyBlock.hidden = isMainHall;
  mainHallDetails.hidden = !isMainHall;
  bookingControls.hidden = isMainHall || !bookingStepOpen;
  facilityActions.hidden = isMainHall;
  continueButton.hidden = isMainHall || bookingStepOpen;
  bookButton.hidden = isMainHall || !bookingStepOpen;
  facilityRates.replaceChildren();
  selectedFacility.rates.forEach((rate) => {
    const item = document.createElement('li');
    item.textContent = rate;
    facilityRates.appendChild(item);
  });
};

const renderTimeSlots = () => {
  timeSlotList.replaceChildren();
  const date = bookingDate.value;
  const bookings = getBookings();
  slots.forEach((slot) => {
    const isBooked = bookings.some((booking) => (
      booking.facility === selectedFacility.name &&
      booking.date === date &&
      booking.time === slot
    ));
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'time-slot';
    button.textContent = isBooked ? `${slot} (Booked)` : slot;
    button.disabled = isBooked;
    button.setAttribute('aria-pressed', String(selectedTime === slot));
    button.addEventListener('click', () => {
      selectedTime = slot;
      bookingMessage.textContent = '';
      renderTimeSlots();
    });
    timeSlotList.appendChild(button);
  });
};

const formatBookingDate = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-CA');
};

const renderBookings = () => {
  const bookings = getBookings();
  bookingList.replaceChildren();
  if (!bookings.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'booking-empty';
    emptyMessage.textContent = 'No bookings yet.';
    bookingList.appendChild(emptyMessage);
    return;
  }

  bookings.forEach((booking) => {
    const card = document.createElement('article');
    card.className = 'booking-card';
    const heading = document.createElement('div');
    heading.className = 'booking-card-heading';
    const facility = document.createElement('span');
    facility.textContent = booking.facility;
    const status = document.createElement('span');
    status.className = 'booking-status';
    status.textContent = booking.status;
    heading.append(facility, status);

    const details = document.createElement('div');
    details.className = 'booking-card-details';
    const date = document.createElement('span');
    date.textContent = `▢ ${formatBookingDate(booking.date)}`;
    const time = document.createElement('span');
    time.textContent = `◷ ${booking.time}`;
    details.append(date, time);
    if (booking.paymentMethod) {
      const paymentMethod = document.createElement('span');
      paymentMethod.className = 'booking-payment';
      paymentMethod.textContent = `Payment: ${booking.paymentMethod}`;
      details.appendChild(paymentMethod);
    }

    const detailsButton = document.createElement('button');
    detailsButton.className = 'booking-details-button';
    detailsButton.type = 'button';
    detailsButton.textContent = 'View details';
    detailsButton.addEventListener('click', () => {
      selectedBooking = booking;
      document.getElementById('bookingDetailFacility').textContent = booking.facility || 'Not specified';
      document.getElementById('bookingDetailDate').textContent = formatBookingDate(booking.date);
      document.getElementById('bookingDetailTime').textContent = booking.time || 'Not specified';
      document.getElementById('bookingDetailStatus').textContent = booking.status || 'Not specified';
      document.getElementById('bookingDetailPayment').textContent = booking.paymentMethod || 'Not specified';
      bookingDetailsDialog.showModal();
    });

    card.append(heading, details, detailsButton);
    bookingList.appendChild(card);
  });
};

document.getElementById('bookingCancelTrigger').addEventListener('click', () => {
  bookingCancelError.textContent = '';
  cancelBookingDialog.showModal();
});

document.getElementById('confirmBookingCancel').addEventListener('click', () => {
  if (!selectedBooking) {
    bookingCancelError.textContent = 'Select a booking before cancelling.';
    return;
  }

  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((booking) => (
    booking.facility === selectedBooking.facility &&
    booking.date === selectedBooking.date &&
    booking.time === selectedBooking.time
  ));
  if (bookingIndex === -1) {
    bookingCancelError.textContent = 'This booking could not be found. Refresh the booking list and try again.';
    renderBookings();
    return;
  }

  bookings.splice(bookingIndex, 1);
  try {
    localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
  } catch (error) {
    console.error('Unable to cancel homeowner booking in local storage.', error);
    bookingCancelError.textContent = 'Unable to cancel this booking right now. Please try again.';
    return;
  }

  selectedBooking = null;
  cancelBookingDialog.close();
  bookingDetailsDialog.close();
  renderBookings();
  renderTimeSlots();
});

const today = new Date();
bookingDate.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
bookingDate.value = bookingDate.min;

renderFacilities();
renderFacilityDetails();
renderBookings();
if (bookingStepOpen) {
  renderTimeSlots();
}
bookingDate.addEventListener('change', () => {
  selectedTime = '';
  bookingMessage.textContent = '';
  renderTimeSlots();
});

continueButton.addEventListener('click', () => {
  bookingStepOpen = true;
  bookingControls.hidden = false;
  continueButton.hidden = true;
  bookButton.hidden = false;
  renderTimeSlots();
});

paymentMethodInputs.forEach((input) => {
  input.addEventListener('change', () => {
    selectedPaymentMethod = input.value;
    bookingMessage.textContent = '';
  });
});

bookButton.addEventListener('click', () => {
  if (selectedFacility.name === 'Main Hall') return;
  if (!bookingDate.value || !selectedTime) {
    bookingMessage.textContent = 'Choose a date and available time slot.';
    return;
  }
  if (!selectedPaymentMethod) {
    bookingMessage.textContent = 'Choose a mode of payment.';
    return;
  }

  const bookings = getBookings();
  const alreadyBooked = bookings.some((booking) => (
    booking.facility === selectedFacility.name &&
    booking.date === bookingDate.value &&
    booking.time === selectedTime
  ));
  if (alreadyBooked) {
    bookingMessage.textContent = 'That time slot is no longer available. Please choose another.';
    renderTimeSlots();
    return;
  }

  bookings.unshift({
    facility: selectedFacility.name,
    date: bookingDate.value,
    time: selectedTime,
    paymentMethod: selectedPaymentMethod,
    status: 'Pending'
  });
  try {
    localStorage.setItem(bookingStorageKey, JSON.stringify(bookings));
  } catch (error) {
    console.error('Unable to save homeowner booking to local storage.', error);
    bookingMessage.textContent = 'Unable to save your booking. Please try again.';
    return;
  }

  selectedTime = '';
  bookingMessage.textContent = 'Your booking request has been added.';
  renderTimeSlots();
  renderBookings();
});

const logoutDialog = document.getElementById('logoutDialog');
document.getElementById('logoutBtn').addEventListener('click', () => logoutDialog.showModal());
document.getElementById('confirmLogout').addEventListener('click', () => {
  window.location.assign(new URL('Login.html', window.location.href).href);
});
