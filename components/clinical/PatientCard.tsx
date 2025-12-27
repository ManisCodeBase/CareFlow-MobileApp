/**
 * Patient Card Component
 * Displays patient face sheet information (demographics, allergies, insurance)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { Patient } from '@/types/clinical';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.demographics}>
            {patient.age}{patient.gender} • MRN: {patient.medicalRecordNumber}
          </Text>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Allergies */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons name="alert-circle" size={16} color={Colors.error} />
            <Text style={styles.labelText}>Allergies</Text>
          </View>
          <View style={styles.allergiesContainer}>
            {patient.allergies.length === 0 ? (
              <Text style={styles.noAllergies}>No known allergies</Text>
            ) : (
              patient.allergies.map((allergy, index) => (
                <View key={index} style={styles.allergyBadge}>
                  <Text style={styles.allergyText}>{allergy}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Insurance */}
        {patient.insuranceProvider && (
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="card" size={16} color={Colors.primary} />
              <Text style={styles.labelText}>Insurance</Text>
            </View>
            <Text style={styles.detailValue}>{patient.insuranceProvider}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.separator,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.4,
  },
  demographics: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    fontWeight: FontWeights.medium,
  },
  detailsGrid: {
    gap: Spacing.lg,
  },
  detailRow: {
    gap: Spacing.md,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  labelText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: FontSizes.base,
    color: Colors.text.primary,
    paddingLeft: Spacing.xl,
    fontWeight: FontWeights.medium,
  },
  allergiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingLeft: Spacing.xl,
  },
  allergyBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.errorDark + '20',
  },
  allergyText: {
    fontSize: FontSizes.sm,
    color: Colors.errorDark,
    fontWeight: FontWeights.semibold,
  },
  noAllergies: {
    fontSize: FontSizes.base,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
    fontWeight: FontWeights.medium,
  },
});
