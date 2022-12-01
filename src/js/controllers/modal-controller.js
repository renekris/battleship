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

function displayModal(parentElement, message = 'Set the message for the modal', duration = null) {
  const elModalWrapper = parentElement.appendChild(createModal(message));
  if (duration !== null) {
    setTimeout(() => removeModal(elModalWrapper), duration);
  }
  elModalWrapper.addEventListener('click', () => removeModal(elModalWrapper));
}

export { displayModal };
