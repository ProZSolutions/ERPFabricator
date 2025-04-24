// LoadingOverlay.js
import React from 'react';
import SpinnerComponent from 'react-native-loading-spinner-overlay';
import SpinnerIcon from '../../assets/svg-component/SpinnerIcon';

const Spinner = ({ visible, textContent = 'Loading...', overlayColor = 'rgba(0, 0, 0, 0.75)' }) => {
  return (
    <SpinnerComponent
      visible={visible}
      textContent={textContent}
      textStyle={{ color: '#FFF' }}
      overlayColor={overlayColor}
      customIndicator = {
        <SpinnerIcon/>
      }
    />
  );
};

export default Spinner;
