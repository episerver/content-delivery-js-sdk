const active = ref(false);

export default () => {
  const showModal = () => {
    active.value = true;
  }

  const hideModal = () => {
    active.value = false;
  }

  return {
    active,
    showModal,
    hideModal,
  }
}
