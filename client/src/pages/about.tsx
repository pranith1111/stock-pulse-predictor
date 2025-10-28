import React from "react";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          About StockPulse Predictor
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          <strong>StockPulse Predictor</strong> is an intelligent stock analysis
          platform that helps investors forecast price trends using historical
          data and sentiment analysis. It combines machine learning algorithms
          with real-time financial indicators to provide you with actionable
          insights.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Whether you're a beginner or an experienced trader, StockPulse makes
          it easier to visualize stock movement, monitor trends, and make data-driven
          decisions. Our mission is to make predictive analytics accessible and
          transparent for everyone.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Built with ❤️ using React, Express, MongoDB, and modern AI
          technologies.
        </p>
      </div>
    </div>
  );
}
