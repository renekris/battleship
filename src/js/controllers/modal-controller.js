function removeModal(elModalWrapper) {
  elModalWrapper.remove();
}

function createModal(message) {
  const elModalWrapper = document.createElement('div');
  elModalWrapper.classList.add('modal-wrapper');

  const elModal = elModalWrapper.appendChild(document.createElement('div'));
  elModal.classList.add('modal');

  const elPara = elModal.appendChild(document.createElement('p'));
  elPara.classList.add('modal-para');
  elPara.textContent = message;

  return elModalWrapper;
}

function displayTimedModal(parentElement, message = 'Set the message for the modal', duration = 2000) {
  const elModalWrapper = parentElement.appendChild(createModal(message));
  setTimeout(() => removeModal(elModalWrapper), duration);
  elModalWrapper.addEventListener('click', (e) => removeModal(e.target));
}

function displayModal(parentElement, message) {
  const elModalWrapper = parentElement.appendChild(createModal(message));
  elModalWrapper.addEventListener('click', (e) => removeModal(e));
}

export { displayTimedModal, displayModal };
