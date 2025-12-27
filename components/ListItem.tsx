import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Props for the ListItem component
 */
interface ListItemProps {
  id: string;
  preview: string;
  createdAt: Date;
}

/**
 * Cleans markdown formatting from preview text
 */
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '')   // Remove italic markers
    .replace(/^#+\s/gm, '') // Remove heading markers
    .replace(/^[-*]\s/gm, '') // Remove bullet points
    .replace(/^\s+/gm, '') // Remove leading spaces
    .trim();
};

/**
 * Formats date to a more readable format
 */
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * ListItem component displays a single note item in the list
 * @param {ListItemProps} props - The props for the ListItem component
 * @returns {React.ReactElement} A touchable list item that links to the note details
 */
const ListItem: React.FC<ListItemProps> = ({ id, preview, createdAt }) => {
  const cleanedPreview = cleanMarkdown(preview);
  const firstLine = cleanedPreview.split('\n')[0] || cleanedPreview.substring(0, 60);
  const displayPreview = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
  
  return (
    <Link href={`/${id}`} asChild>
      <TouchableOpacity style={styles.listItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle} numberOfLines={2}>
            {displayPreview || 'Untitled Note'}
          </Text>
          <Text style={styles.listItemTimestamp}>
            {formatDate(createdAt)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    gap: 6,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight: 22,
  },
  listItemTimestamp: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
});

export default ListItem;
