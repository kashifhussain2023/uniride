export const cardValidation = inputs => {
  const errors = {};
  if (!inputs.card_holder || inputs.card_holder.trim() === '') {
    errors.card_holder = 'Card holder name field is required';
  } else {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(inputs.card_holder)) {
      errors.card_holder = 'Name should only contain letters';
    }
  }
  return errors;
};
