import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { ArrowLeft, Clock, Heart, Bookmark, Share2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image: string;
  author: string;
  date: string;
  liked: boolean;
  saved: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Science of Box Breathing',
    excerpt: 'Discover how this simple technique can transform your stress response and bring calm to your day.',
    content: `Box breathing, also known as square breathing, is a powerful stress-relief technique used by Navy SEALs, athletes, and mindfulness practitioners worldwide.

The technique involves breathing in four equal parts:
• Inhale for 4 seconds
• Hold for 4 seconds  
• Exhale for 4 seconds
• Hold for 4 seconds

This pattern activates your parasympathetic nervous system, reducing cortisol levels and promoting a sense of calm. Regular practice can improve focus, reduce anxiety, and help you sleep better.

Try incorporating box breathing into your morning routine or use it whenever you feel overwhelmed. Even just 2-3 minutes can make a significant difference in your mental state.`,
    category: 'Breathing',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    author: 'Dr. Sarah Chen',
    date: 'Dec 15, 2024',
    liked: false,
    saved: false,
  },
  {
    id: '2',
    title: 'Building a Mood Tracking Habit',
    excerpt: 'Learn why tracking your emotions daily can lead to profound self-awareness and emotional growth.',
    content: `Mood tracking is more than just recording how you feel—it's a gateway to understanding your emotional patterns and triggers.

Benefits of daily mood tracking:
• Identify patterns in your emotional cycles
• Recognize triggers that affect your mood
• Track progress over time
• Improve communication with therapists or loved ones

Start small: just rate your mood once a day. Over time, add context like sleep quality, activities, or social interactions. After a few weeks, you'll start seeing patterns that can help you make positive changes.

Remember, there's no "right" way to feel. The goal isn't to always be happy—it's to understand yourself better.`,
    category: 'Wellness',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    author: 'Maya Johnson',
    date: 'Dec 12, 2024',
    liked: true,
    saved: false,
  },
  {
    id: '3',
    title: 'Morning Rituals for Mental Clarity',
    excerpt: 'Start your day with intention using these simple practices that set the tone for success.',
    content: `How you start your morning often determines the quality of your entire day. Creating a mindful morning ritual can boost your mental clarity and emotional resilience.

Try these practices:
• Wake up 15 minutes earlier for quiet time
• Practice gratitude by listing 3 things you're thankful for
• Do a brief body scan meditation
• Set one intention for the day
• Avoid checking your phone for the first 30 minutes

The key is consistency over perfection. Even a 5-minute morning ritual, done daily, can create lasting positive changes in your mental well-being.

Start with just one practice and build from there. Your future self will thank you.`,
    category: 'Mindfulness',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
    author: 'James Park',
    date: 'Dec 10, 2024',
    liked: false,
    saved: true,
  },
  {
    id: '4',
    title: 'Understanding Emotional Triggers',
    excerpt: 'Recognize what sets off your emotional responses and learn to respond rather than react.',
    content: `Emotional triggers are stimuli that provoke strong emotional reactions, often rooted in past experiences. Understanding your triggers is the first step to emotional freedom.

Common triggers include:
• Feeling ignored or dismissed
• Criticism or perceived judgment
• Feeling out of control
• Reminders of past trauma
• Stress and overwhelm

When triggered, try the STOP technique:
S - Stop what you're doing
T - Take a breath
O - Observe your feelings without judgment
P - Proceed with awareness

With practice, you can create space between stimulus and response, allowing you to choose how you react rather than being controlled by automatic patterns.`,
    category: 'Psychology',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
    author: 'Dr. Lisa Wong',
    date: 'Dec 8, 2024',
    liked: false,
    saved: false,
  },
];

const CATEGORIES = ['All', 'Breathing', 'Wellness', 'Mindfulness', 'Psychology'];

export default function BlogScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState(BLOG_POSTS);

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, liked: !p.liked } : p
    ));
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, saved: !p.saved } : p
    ));
  };

  // Article Detail View
  if (selectedPost) {
    const post = posts.find(p => p.id === selectedPost.id) || selectedPost;
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
          <TouchableOpacity onPress={() => setSelectedPost(null)} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => toggleLike(post.id)}>
              <Heart size={22} color={post.liked ? '#ef4444' : '#94a3b8'} fill={post.liked ? '#ef4444' : 'none'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSave(post.id)}>
              <Bookmark size={22} color={post.saved ? '#6366f1' : '#94a3b8'} fill={post.saved ? '#6366f1' : 'none'} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Share2 size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <Image 
            source={{ uri: post.image }} 
            className="w-full h-56"
            resizeMode="cover"
          />

          <View className="px-5 py-6">
            {/* Category & Read Time */}
            <View className="flex-row items-center gap-3 mb-3">
              <View className="bg-indigo-100 px-3 py-1 rounded-full">
                <Text className="text-indigo-600 text-xs font-semibold">{post.category}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Clock size={14} color="#94a3b8" />
                <Text className="text-slate-400 text-xs">{post.readTime}</Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-slate-800 mb-4 leading-tight">
              {post.title}
            </Text>

            {/* Author & Date */}
            <View className="flex-row items-center mb-6 pb-6 border-b border-slate-100">
              <View className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">{post.author.charAt(0)}</Text>
              </View>
              <View>
                <Text className="text-slate-700 font-medium">{post.author}</Text>
                <Text className="text-slate-400 text-sm">{post.date}</Text>
              </View>
            </View>

            {/* Content */}
            <Text className="text-slate-600 text-base leading-7 whitespace-pre-line">
              {post.content}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Blog List View
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <ArrowLeft size={24} color="#334155" />
            </TouchableOpacity>
          </View>
          <Text className="text-slate-800 text-2xl font-bold">Wellness Journal</Text>
          <Text className="text-slate-500 text-sm mt-1">Insights for your mindful journey</Text>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-5 mb-4"
        >
          <View className="flex-row gap-2">
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600' 
                    : 'bg-white border border-slate-200'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedCategory === cat ? 'text-white' : 'text-slate-600'
                }`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSelectedPost(filteredPosts[0])}
            className="mx-5 mb-4"
          >
            <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <Image 
                source={{ uri: filteredPosts[0].image }} 
                className="w-full h-48"
                resizeMode="cover"
              />
              <View className="p-4">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="bg-indigo-100 px-2 py-0.5 rounded-full">
                    <Text className="text-indigo-600 text-xs font-medium">{filteredPosts[0].category}</Text>
                  </View>
                  <Text className="text-slate-400 text-xs">{filteredPosts[0].readTime}</Text>
                </View>
                <Text className="text-lg font-bold text-slate-800 mb-2">{filteredPosts[0].title}</Text>
                <Text className="text-slate-500 text-sm leading-relaxed" numberOfLines={2}>
                  {filteredPosts[0].excerpt}
                </Text>
                <View className="flex-row items-center mt-3">
                  <Text className="text-indigo-600 text-sm font-semibold">Read more</Text>
                  <ChevronRight size={16} color="#6366f1" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Other Posts */}
        <View className="px-5 pb-8">
          <Text className="text-slate-800 font-bold text-lg mb-4">More Articles</Text>
          {filteredPosts.slice(1).map(post => (
            <TouchableOpacity 
              key={post.id}
              onPress={() => setSelectedPost(post)}
              className="bg-white rounded-xl p-4 mb-3 flex-row border border-slate-100 shadow-sm"
            >
              <Image 
                source={{ uri: post.image }} 
                className="w-20 h-20 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1 justify-center">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-indigo-600 text-xs font-medium">{post.category}</Text>
                  <Text className="text-slate-300">•</Text>
                  <Text className="text-slate-400 text-xs">{post.readTime}</Text>
                </View>
                <Text className="text-slate-800 font-semibold mb-1" numberOfLines={2}>
                  {post.title}
                </Text>
                <Text className="text-slate-400 text-xs">{post.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
