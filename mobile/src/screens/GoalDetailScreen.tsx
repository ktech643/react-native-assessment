import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { goalService } from '../services/api';
import { colors } from '../theme/colors';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// TODO: Task 4 - Complete Goal Detail Screen
// Requirements:
// 1. Fetch goal details from goalService.getGoal(id)
// 2. Display all goal information
// 3. Add ability to update goal status
// 4. Show creation and update dates
// 5. Add delete goal functionality with confirmation
// 6. Navigate back after delete
// 7. Handle loading and error states

export default function GoalDetailScreen({ route, navigation }: any) {
  const { goalId } = route.params;
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
  }, [goalId]);

  const loadGoal = async () => {
    try {
      setLoading(true);
      const data = await goalService.getGoal(goalId);
      setGoal(data);
    } catch (error: any) {
      console.error('Error loading goal:', error);
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Unable to load goal details. Please check your internet connection.';
      Alert.alert('Error', errorMessage);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!goal) return;

    try {
      const updated = await goalService.updateGoal(goal.id, { status: newStatus });
      setGoal(updated);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                          error.message ||
                          'Unable to update goal status. Please check your internet connection.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDelete = () => {
    if (!goal) return;

    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await goalService.deleteGoal(goal.id);
              navigation.goBack();
            } catch (error: any) {
              const errorMessage = error.response?.data?.error ||
                                  error.message ||
                                  'Unable to delete goal. Please check your internet connection.';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={styles.centerContainer}>
        <Text>Goal not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{goal.title}</Text>
        
        {goal.description && (
          <Text style={styles.description}>{goal.description}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            {['not_started', 'in_progress', 'completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  goal.status === status && styles.statusButtonActive,
                ]}
                onPress={() => handleUpdateStatus(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    goal.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${goal.progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{goal.progress}%</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Created: {new Date(goal.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.metaText}>
            Updated: {new Date(goal.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Goal</Text>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: height * 0.02, // 2% of screen height
    paddingVertical: height * 0.01, // 1% of screen height
    paddingHorizontal: width * 0.03, // 3% of screen width
  },
  backButtonText: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    padding: width * 0.05, // 5% of screen width
  },
  title: {
    fontSize: Math.min(width * 0.06, 24), // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.015, // 1.5% of screen height
    color: colors.primary,
  },
  description: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    color: colors.textSecondary,
    marginBottom: height * 0.03, // 3% of screen height
    lineHeight: Math.min(width * 0.055, 24), // Responsive line height
  },
  section: {
    marginBottom: height * 0.03, // 3% of screen height
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
    marginBottom: height * 0.015, // 1.5% of screen height
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: width * 0.02, // 2% of screen width
  },
  statusButton: {
    paddingHorizontal: width * 0.04, // 4% of screen width
    paddingVertical: height * 0.01, // 1% of screen height
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    flex: 1,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    fontWeight: '600',
    textTransform: 'capitalize',
    color: colors.textSecondary,
  },
  statusButtonTextActive: {
    color: colors.background,
  },
  progressBar: {
    height: height * 0.01, // 1% of screen height
    backgroundColor: colors.notStarted,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: height * 0.01, // 1% of screen height
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressText: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size
    fontWeight: '600',
    color: colors.accent,
  },
  meta: {
    marginTop: height * 0.01, // 1% of screen height
    paddingTop: height * 0.02, // 2% of screen height
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metaText: {
    fontSize: Math.min(width * 0.03, 12), // Responsive font size
    color: colors.textTertiary,
    marginBottom: height * 0.005, // 0.5% of screen height
  },
  deleteButton: {
    marginTop: height * 0.03, // 3% of screen height
    padding: height * 0.02, // 2% of screen height
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  deleteButtonText: {
    color: colors.background,
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '600',
  },
});

