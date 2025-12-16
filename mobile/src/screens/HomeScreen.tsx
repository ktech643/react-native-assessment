import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome back, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Let's track your career goals</Text>
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: width * 0.05, // 5% of screen width
  },
  welcome: {
    fontSize: Math.min(width * 0.06, 24), // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.01, // 1% of screen height
    color: colors.primary,
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    color: colors.secondary,
  },
});

