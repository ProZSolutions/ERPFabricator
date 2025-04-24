export const validateAddChitForm = (formValues) => {
    let newErrors = {};
    if (!formValues.chitName) {
      newErrors.chitName = "Enter the Chit Name";
    }
    if (!formValues.totalChitValue) {
      newErrors.totalChitValue = "Enter the total chit amount";
    }
  
    if (!formValues.interest || !formValues.interestAmount) {
      newErrors.interest =
        "Enter either the interest percentage or the interest amount.";
    }
  
    if (
      formValues.is_commission !== 2 &&
      (!formValues.commision || !formValues.commisionAmount)
    ) {
      newErrors.commision =
        "Enter either the commission percentage or commission amount";
    }
  
    if (!formValues.startDate) {
      newErrors.startDate = "Select a start date";
    }
  
    if (!formValues.chitType) {
      newErrors.chitType = "Select a chit type";
    }
  
    if (formValues.chitType != 5 && !formValues.multipleAuctionValue) {
      newErrors.multipleAuctionValue = "Enter the multiple auction value";
    }
  
    if (formValues.isChitReceiving && !formValues.chitReceivingMonth) {
      newErrors.chitReceivingMonth = "Select a chit receiving month";
    }
  
    if (formValues.chitType != 5 && !formValues.initialAmount) {
      newErrors.initialAmount = "Select the Initial Amount";
    }
  
    return newErrors;
  };
  