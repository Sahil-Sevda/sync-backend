const validateFields = (requiredFields, body) => {
  const missingFields = requiredFields.filter((field) => !(field in body));
  return missingFields;
};

export {
  validateFields,
};
