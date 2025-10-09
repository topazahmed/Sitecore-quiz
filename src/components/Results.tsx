import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { QuizResult } from '../types/quiz';
import '../styles/Results.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ResultsProps {
  result: QuizResult;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onRestart }) => {
  const chartData = {
    labels: result.topicScores.map(score => score.topic),
    datasets: [
      {
        label: 'Average Score',
        data: result.topicScores.map(score => score.averageWeight),
        backgroundColor: [
          '#0066cc',
          '#ff6600', 
          '#003366',
          '#00cc66',
          '#0099cc',
        ],
        borderColor: [
          '#004499',
          '#cc4400',
          '#001122',
          '#009944',
          '#007799',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Your Profile by Topic',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutData = {
    labels: result.topicScores.map(score => score.topic),
    datasets: [
      {
        data: result.topicScores.map(score => score.totalWeight),
        backgroundColor: [
          '#0066cc',
          '#ff6600', 
          '#003366',
          '#00cc66',
          '#0099cc',
        ],
        borderColor: [
          '#004499',
          '#cc4400',
          '#001122',
          '#009944',
          '#007799',
        ],
        borderWidth: 2,
      },
    ],
  };

  const shareResults = () => {
    const text = `I just completed a personality quiz! My total score: ${result.totalScore}`;
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Results',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="completion-icon">✨</div>
        <h2>Your Work Style Results</h2>
        <div className="total-score">Overall Score: {result.totalScore}</div>
      </div>

      <div className="chart-container">
        <h3>Your Profile Overview</h3>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="topic-scores">
        <h3>Detailed Breakdown</h3>
        {result.topicScores.map((score, index) => (
          <div key={score.topic} className="topic-item">
            <span className="topic-name">{score.topic}</span>
            <span className="topic-score">{score.averageWeight}/5</span>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <h3>Score Distribution</h3>
        <div className="chart-wrapper">
          <Doughnut data={doughnutData} />
        </div>
      </div>

      <div className="results-actions">
        <button className="action-button btn-restart" onClick={onRestart}>
          Take Quiz Again
        </button>
        <button className="action-button btn-share" onClick={shareResults}>
          Share Results
        </button>
      </div>
    </div>
  );
};

export default Results;