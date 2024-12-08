import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsGraphs = ({ analytics }) => {
    // Chart Options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'rgba(255, 255, 255, 0.8)' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.8)' }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.8)' }
            }
        }
    };

    // Enrollment Data
    const enrollmentData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Enrollments',
                data: analytics?.weeklyEnrollments || [0, 0, 0, 0],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Progress Distribution
    const progressData = {
        labels: ['0-25%', '26-50%', '51-75%', '76-100%'],
        datasets: [{
            label: 'Students',
            data: analytics?.progressDistribution || [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }]
    };

    // Quiz Performance
    const quizData = {
        labels: analytics?.quizzes?.map(q => q.title) || [],
        datasets: [{
            label: 'Average Score',
            data: analytics?.quizzes?.map(q => q.averageScore) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    return (
        <div className="space-y-8">
            {/* Enrollment Trends */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Enrollment Trends</h3>
                <div className="h-[300px]">
                    <Line data={enrollmentData} options={commonOptions} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Distribution */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Progress Distribution</h3>
                    <div className="h-[300px]">
                        <Doughnut 
                            data={progressData} 
                            options={{
                                ...commonOptions,
                                cutout: '70%'
                            }} 
                        />
                    </div>
                </div>

                {/* Quiz Performance */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Quiz Performance</h3>
                    <div className="h-[300px]">
                        <Bar data={quizData} options={commonOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsGraphs; 