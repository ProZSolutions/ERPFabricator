import { useState } from 'react';

function useForm(initialFormData, requiredFields) {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    if (field === "attachedDocuments") {
        setFormData((prevState) => ({
            ...prevState,
            attachedDocuments: value.name,
            document: value.base64,
        }));
    } else {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }
    if (formErrors[field]) {
        setFormErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
      }
    
  };

  const validateForm = () => {
    let errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return { formData, handleInputChange, formErrors, setFormErrors, validateForm , setFormData};
}

export default useForm;
