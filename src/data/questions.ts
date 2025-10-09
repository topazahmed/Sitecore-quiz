import { Question } from '../types/quiz';

export const quizQuestions: Question[] = [
  {
    id: 'q1',
    text: 'How do you prefer to communicate with your team?',
    topic: 'Communication',
    answers: [
      { id: 'q1a1', text: 'Face-to-face meetings', weight: 4, topic: 'Communication' },
      { id: 'q1a2', text: 'Video calls', weight: 3, topic: 'Communication' },
      { id: 'q1a3', text: 'Instant messaging', weight: 2, topic: 'Communication' },
      { id: 'q1a4', text: 'Email', weight: 1, topic: 'Communication' },
    ]
  },
  {
    id: 'q2',
    text: 'What motivates you most at work?',
    topic: 'Motivation',
    answers: [
      { id: 'q2a1', text: 'Recognition and praise', weight: 4, topic: 'Motivation' },
      { id: 'q2a2', text: 'Financial rewards', weight: 3, topic: 'Motivation' },
      { id: 'q2a3', text: 'Learning new skills', weight: 5, topic: 'Motivation' },
      { id: 'q2a4', text: 'Work-life balance', weight: 2, topic: 'Motivation' },
      { id: 'q2a5', text: 'Career advancement', weight: 4, topic: 'Motivation' },
    ]
  },
  {
    id: 'q3',
    text: 'How do you handle stressful situations?',
    topic: 'Stress Management',
    answers: [
      { id: 'q3a1', text: 'Take a break and recharge', weight: 3, topic: 'Stress Management' },
      { id: 'q3a2', text: 'Work through it immediately', weight: 5, topic: 'Stress Management' },
      { id: 'q3a3', text: 'Ask for help from colleagues', weight: 4, topic: 'Stress Management' },
      { id: 'q3a4', text: 'Plan and prioritize tasks', weight: 4, topic: 'Stress Management' },
    ]
  },
  {
    id: 'q4',
    text: 'What type of work environment do you thrive in?',
    topic: 'Work Environment',
    answers: [
      { id: 'q4a1', text: 'Quiet and focused', weight: 3, topic: 'Work Environment' },
      { id: 'q4a2', text: 'Collaborative and social', weight: 4, topic: 'Work Environment' },
      { id: 'q4a3', text: 'Fast-paced and dynamic', weight: 5, topic: 'Work Environment' },
      { id: 'q4a4', text: 'Structured and organized', weight: 2, topic: 'Work Environment' },
    ]
  },
  {
    id: 'q5',
    text: 'How do you approach problem-solving?',
    topic: 'Problem Solving',
    answers: [
      { id: 'q5a1', text: 'Analyze data and research', weight: 4, topic: 'Problem Solving' },
      { id: 'q5a2', text: 'Brainstorm with others', weight: 3, topic: 'Problem Solving' },
      { id: 'q5a3', text: 'Try different solutions quickly', weight: 5, topic: 'Problem Solving' },
      { id: 'q5a4', text: 'Follow established procedures', weight: 2, topic: 'Problem Solving' },
    ]
  }
];