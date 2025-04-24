export const formatCurrency = (value) => {
  return parseFloat(value).toFixed(2);
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};


export const chitNameFormat = (name = '', id = '') => {
  if (!name) return id; // If name is empty, return id
  return `${capitalizeFirstLetter(name)} - ${id}`;
};
