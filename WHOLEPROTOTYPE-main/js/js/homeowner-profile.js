const profileTrigger = document.getElementById('profileTrigger');
const profileDialog = document.getElementById('profileDialog');

if (profileTrigger && profileDialog) {
  const profileClose = document.getElementById('profileClose');
  const profileName = profileTrigger.querySelector('.profile-name');
  const profileNameDisplay = profileDialog.querySelector('.profile-name-display');

  if (profileName && profileNameDisplay) {
    profileNameDisplay.textContent = profileName.textContent.trim();
  }

  profileTrigger.addEventListener('click', () => {
    if (profileDialog.open) {
      profileDialog.close();
      return;
    }

    profileDialog.show();
    profileTrigger.setAttribute('aria-expanded', 'true');
    profileClose.focus();
  });

  profileClose.addEventListener('click', () => profileDialog.close());
  profileDialog.addEventListener('close', () => {
    profileTrigger.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('pointerdown', (event) => {
    if (
      profileDialog.open &&
      !profileDialog.contains(event.target) &&
      !profileTrigger.contains(event.target)
    ) {
      profileDialog.close();
    }
  });
}
