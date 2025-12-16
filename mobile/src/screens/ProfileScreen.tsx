import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { colors } from '../theme/colors';

// TODO: Task 2 - Complete Profile Screen
// Requirements:
// 1. Display user information (name, email)
// 2. Add edit profile functionality
// 3. Integrate with userService.getProfile() and userService.updateProfile()
// 4. Show loading and error states
// 5. Add logout functionality
// 6. Update local auth context after profile update

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setName(profile.name);
      setEmail(profile.email);
      updateUser(profile);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Unable to load profile. Please check your internet connection.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await userService.updateProfile({ name, email });
      updateUser(updated);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Unable to update profile. Please check your internet connection.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (loading && !user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: width * 0.05, // 5% of screen width
  },
  title: {
    fontSize: Math.min(width * 0.07, 28), // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.03, // 3% of screen height
    color: colors.primary,
    textAlign: 'center',
  },
  section: {
    marginBottom: height * 0.03, // 3% of screen height
  },
  label: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    fontWeight: '600',
    marginBottom: height * 0.01, // 1% of screen height
    color: colors.text,
  },
  value: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    color: colors.textSecondary,
    backgroundColor: colors.card,
    padding: height * 0.015, // Responsive padding
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    padding: height * 0.018, // Responsive padding
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: height * 0.01, // 1% of screen height
  },
  button: {
    borderRadius: 12,
    padding: height * 0.02, // Responsive padding
    alignItems: 'center',
    marginBottom: height * 0.015, // 1.5% of screen height
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  editButton: {
    backgroundColor: colors.buttonPrimary,
  },
  saveButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.textTertiary,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    marginTop: height * 0.025, // 2.5% of screen height
  },
  buttonText: {
    color: colors.background,
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
  },
  logoutButtonText: {
    color: colors.background,
  },
});

