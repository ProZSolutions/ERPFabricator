// NoNetwork.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NoNetwork = ({ onRetry }) => {
    return (
        <View style={styles.container}>
        <MaterialIcons name="wifi-off" size={80} color="#ff3b30" style={styles.icon} />
            <Text style={styles.text}>No Internet Connection</Text>
            <Button title="Retry" onPress={onRetry} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    },
    text: {
        fontSize: 18, marginBottom: 20,color:'black'
    },
});

export default NoNetwork;
