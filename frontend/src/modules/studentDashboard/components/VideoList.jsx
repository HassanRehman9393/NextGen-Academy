import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import VideoCard from './VideoCard';
import { FaVideo } from 'react-icons/fa';

const VideoList = () => {
    const { videos } = useDashboard();

    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-full p-6 mb-6 border border-white/10">
                    <FaVideo className="text-4xl text-yellow-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                    No Videos Found
                </h3>
                <p className="text-white/70 max-w-md text-lg">
                    We couldn't find any videos matching your criteria. Try adjusting your filters or search terms.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
};

export default VideoList; 