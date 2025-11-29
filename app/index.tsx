import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Plus, Wind, BarChart2, BookOpen, PlusCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import MoodChart from '@/components/MoodChart';
import MoodEntryCard from '@/components/MoodEntryCard';
import HistoryFeed from '@/components/HistoryFeed';
import BreathingModal from '@/components/BreathingModal';
import StatsCard from '@/components/StatsCard';

export default function HomeScreen() {
  const router = useRouter();
  const { entries, isLoading, addEntry, deleteEntry } = useLocalStorage();
  const [view, setView] = useState<'dashboard' | 'entry' | 'breathe'>('dashboard');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSaveEntry = useCallback(
    async (entry: { mood: number; tags: string[]; notes: string }) => {
      await addEntry(entry);
      setView('dashboard');
    },
    [addEntry]
  );

  const handleTagFilter = useCallback((tag: string | null) => {
    setActiveFilter(tag);
  }, []);

  const averageMood = useMemo(() => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, curr) => acc + curr.mood, 0);
    return (sum / entries.length).toFixed(1);
  }, [entries]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center">
          <Text className="text-2xl">✨</Text>
        </View>
        <Text className="text-slate-600 mt-3 font-medium">Loading...</Text>
      </View>
    );
  }

  // Entry Form View
  if (view === 'entry') {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <MoodEntryCard
          onSave={handleSaveEntry}
          onClose={() => setView('dashboard')}
        />
      </SafeAreaView>
    );
  }

  // Breathing View
  if (view === 'breathe') {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <BreathingModal
          visible={true}
          onClose={() => setView('dashboard')}
        />
      </SafeAreaView>
    );
  }

  // Dashboard View
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-6 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-800 text-2xl font-bold">Hello, Friend</Text>
            <Text className="text-slate-500 text-sm mt-1">Let's check in on you.</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/blog')}
            className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center"
          >
            <BookOpen size={18} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View className="px-5 mt-4">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <View className="mb-1">
                <BarChart2 size={20} color="#818cf8" />
              </View>
              <Text className="text-2xl font-bold text-indigo-900">{averageMood || '-'}</Text>
              <Text className="text-xs text-indigo-600/70">Avg Mood</Text>
            </View>
            <View className="flex-1 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <View className="mb-1">
                <BookOpen size={20} color="#6ee7b7" />
              </View>
              <Text className="text-2xl font-bold text-emerald-900">{entries.length}</Text>
              <Text className="text-xs text-emerald-600/70">Total Entries</Text>
            </View>
          </View>
        </View>

        {/* Mood Chart */}
        <View className="px-5 mt-4">
          <MoodChart entries={entries} />
        </View>

        {/* History Feed */}
        <View className="px-5 mt-4 pb-28" style={{ minHeight: 300 }}>
          <HistoryFeed
            entries={entries}
            activeFilter={activeFilter}
            onTagFilter={handleTagFilter}
            onDelete={deleteEntry}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => setView('dashboard')}
          className="flex-col items-center gap-1"
        >
          <BarChart2 size={24} color={view === 'dashboard' ? '#6366f1' : '#94a3b8'} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
          <Text className={`text-[10px] font-medium ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>Insights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setView('entry')}
          className="w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg -mt-8 border-4 border-slate-50"
        >
          <PlusCircle size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setView('breathe')}
          className="flex-col items-center gap-1"
        >
          <Wind size={24} color={view === 'breathe' ? '#6366f1' : '#94a3b8'} strokeWidth={view === 'breathe' ? 2.5 : 2} />
          <Text className={`text-[10px] font-medium ${view === 'breathe' ? 'text-indigo-600' : 'text-slate-400'}`}>Breathe</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
