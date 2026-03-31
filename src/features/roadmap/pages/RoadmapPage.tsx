import { useState } from 'react';
import RoadmapCanvas from '../components/RoadmapCanvas';
import type { Milestone } from '../types';

// Mock data - replace with actual API data
const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'Introduction',
    description: 'Learn the basics and get started with your learning journey.',
    chapter: 1,
    isUnlocked: true,
    isCompleted: true,
    points: 100,
  },
  {
    id: 'm2',
    title: 'Core Concepts',
    description: 'Dive deep into fundamental concepts and principles.',
    chapter: 2,
    isUnlocked: true,
    isCompleted: true,
    points: 150,
  },
  {
    id: 'm3',
    title: 'Advanced Topics',
    description: 'Explore advanced techniques and applications.',
    chapter: 3,
    isUnlocked: true,
    isCompleted: false,
    points: 200,
  },
  {
    id: 'm4',
    title: 'Practical Applications',
    description: 'Apply your knowledge to real-world scenarios.',
    chapter: 4,
    isUnlocked: false,
    isCompleted: false,
    points: 250,
  },
  {
    id: 'm5',
    title: 'Mastery Challenge',
    description: 'Test your complete understanding with a final challenge.',
    chapter: 5,
    isUnlocked: false,
    isCompleted: false,
    points: 300,
  },
];

export default function RoadmapPage() {
  const [milestones] = useState<Milestone[]>(MOCK_MILESTONES);
  
  // Find current milestone index (first incomplete milestone)
  const currentMilestoneIndex = milestones.findIndex(m => !m.isCompleted);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Your Learning Roadmap
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress through the course chapters
        </p>
      </div>

      <RoadmapCanvas
        milestones={milestones}
        currentMilestoneIndex={currentMilestoneIndex === -1 ? milestones.length - 1 : currentMilestoneIndex}
      />
    </div>
  );
}