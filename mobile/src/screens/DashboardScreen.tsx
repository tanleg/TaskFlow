import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardHeader from '../views/DashboardHeader';
import DashboardContent from '../views/DashboardContent';

const DashboardScreen: React.FC = () => {
    return (
        <View style={styles.container}>
        
            {/* En-tête du Dashboard */}
            <DashboardHeader />

            {/* Contenu du Dashboard */}
            <DashboardContent />
        
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});
