function removeModal(elModalWrapper) {
  elModalWrapper.remove();
}

function createModal(message, buttonName = null, buttonCallback = null) {
  const elModalWrapper = document.createElement('div');
  elModalWrapper.classList.add('modal-wrapper');

  const elModal = elModalWrapper.appendChild(document.createElement('div'));
  elModal.classList.add('modal');

  const elPara = elModal.appendChild(document.createElement('p'));
  elPara.classList.add('modal-para');
  elPara.textContent = message;

  if (buttonName !== null) {
    const elButton = elModal.appendChild(document.createElement('button'));
    elButton.classList.add('modal-button');
    elButton.textContent = buttonName;
    if (buttonCallback !== null) {
      elButton.addEventListener('click', (e) => {
        removeModal(elModalWrapper);
        buttonCallback(e);
      });
    } else {
      elButton.addEventListener('click', () => { throw new Error('Modal button is missing callback') });
    }
  }

  return elModalWrapper;
}

function displayModal(parentElement, message = 'Set the message for the modal', duration = null) {
  const elModalWrapper = parentElement.appendChild(createModal(message));
  if (duration !== null) {
    setTimeout(() => removeModal(elModalWrapper), duration);
  }
  elModalWrapper.addEventListener('click', () => removeModal(elModalWrapper));
}

function displayButtonModal(parentElement, message, buttonName, buttonCallback) {
  parentElement.appendChild(createModal(message, buttonName, buttonCallback));
}

export { displayModal, displayButtonModal };
