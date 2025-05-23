import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  Text,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';

import { launchCamera } from 'react-native-image-picker';

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export default function FrontCameraCapture() {
  const [imageUri, setImageUri] = useState(null);

  // Function to check & request camera permission dynamically
  const requestCameraPermission = async () => {
    let permission;

    if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA;
    } else if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else {
      Alert.alert('Unsupported Platform');
      return false;
    }

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      return true;
    } else if (result === RESULTS.DENIED) {
      const reqResult = await request(permission);
      return reqResult === RESULTS.GRANTED;
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Camera permission is blocked. Please enable it from settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return false;
  };

  // Open front camera forcibly
  const openFrontCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Camera Permission Required', 'Cannot open camera without permission.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front', // Force front camera
        quality: 1,
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera error:', response.errorMessage);
          Alert.alert('Camera error', response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            setImageUri(response.assets[0].uri);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Capture Image</Text>
      <Button title="Open  Camera" onPress={openFrontCamera} />
      {imageUri && (
        <>
          <Text style={styles.previewText}>Captured Image Preview:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20,color:'black' },
  previewText: { marginTop: 20, fontSize: 16 ,color:'black'},
  image: { width: 300, height: 400, marginTop: 10, borderRadius: 10 },
});
