import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { X, Frown, Meh, Smile } from 'lucide-react-native';
import { CONTEXT_TAGS, MOOD_EMOJIS, ContextTag } from '@/app/types';

interface MoodEntryCardProps {
  onSave: (entry: { mood: number; tags: string[]; notes: string }) => void;
  onClose: () => void;
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Rough',
  2: 'Not great',
  3: 'Okay',
  4: 'Good',
  5: 'Amazing',
};

export default function MoodEntryCard({ onSave, onClose }: MoodEntryCardProps) {
  const [mood, setMood] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleTag = (tag: ContextTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    onSave({ mood, tags: selectedTags, notes });
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800">New Check-in</Text>
          <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Mood Slider */}
        <View className="mb-8">
          <Text className="text-sm font-medium text-slate-500 mb-4">How are you feeling?</Text>
          
          {/* Mood Icons */}
          <View className="flex-row justify-between mb-3 px-2">
            <Frown size={32} color={mood <= 2 ? '#f43f5e' : '#cbd5e1'} />
            <Meh size={32} color={mood === 3 ? '#f59e0b' : '#cbd5e1'} />
            <Smile size={32} color={mood >= 4 ? '#10b981' : '#cbd5e1'} />
          </View>

          {/* Slider Buttons */}
          <View className="flex-row items-center w-full gap-2">
            {[1, 2, 3, 4, 5].map(value => (
              <TouchableOpacity
                key={value}
                onPress={() => setMood(value)}
                className={`flex-1 h-12 rounded-xl items-center justify-center ${
                  mood === value 
                    ? value <= 2 ? 'bg-rose-500' : value === 3 ? 'bg-amber-500' : 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              >
                <Text className={`font-bold text-lg ${mood === value ? 'text-white' : 'text-slate-500'}`}>
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mood Label */}
          <Text className="text-center mt-3 font-semibold text-indigo-600">
            {MOOD_LABELS[mood]}
          </Text>
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-slate-500 mb-2">What's on your mind?</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Today was..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            className="bg-white rounded-xl p-4 text-slate-700 min-h-[120px] border border-slate-200"
            textAlignVertical="top"
          />
        </View>

        {/* Context Tags */}
        <View className="mb-8">
          <Text className="text-sm font-medium text-slate-500 mb-3">What affected your mood?</Text>
          <View className="flex-row flex-wrap gap-2">
            {CONTEXT_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-600'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedTags.includes(tag) ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-slate-100 rounded-xl py-4 items-center"
          >
            <Text className="text-slate-600 font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 bg-indigo-600 rounded-xl py-4 items-center shadow-lg"
          >
            <Text className="text-white font-semibold text-base">Save Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
