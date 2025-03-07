import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardHeader from '../views/DashboardHeader';
import DashboardContent from '../views/DashboardContent';
import DetailsProjet from '../views/DetailsProjet';

const DetailsProjetScreen: React.FC = () => {
    return (
        <View style={styles.container}>
          <DetailsProjet />
        </View>
    );
};

export default DetailsProjetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});
