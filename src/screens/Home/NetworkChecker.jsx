import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function NetworkChecker({ onRetry }) {
  const [isConnected, setIsConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  const handleRetry = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setShowModal(false);
        if (onRetry) onRetry();
      } else {
        setShowModal(true);
      }
    });
  };

  return (
    <Modal visible={showModal} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>No Internet Connection</Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
  },
  modalContent: {
    backgroundColor:'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems:'center',
  },
  modalText: {
    fontSize:16,
    marginBottom: 20,
    color:'black',
    marginTop:10
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical:10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
