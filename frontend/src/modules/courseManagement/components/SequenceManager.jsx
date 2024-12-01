import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaVideo, FaQuestionCircle, FaGripVertical, FaTrash } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';

const SequenceManager = ({ courseId, sequence, onSequenceChange }) => {
    const { handleReorderContent, handleRemoveContent } = useCourse();

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const fromIndex = result.source.index;
        const toIndex = result.destination.index;

        if (fromIndex === toIndex) return;

        try {
            await handleReorderContent(courseId, fromIndex, toIndex);
        } catch (error) {
            console.error('Error reordering content:', error);
        }
    };

    const handleRemove = async (index) => {
        try {
            await handleRemoveContent(courseId, index);
        } catch (error) {
            console.error('Error removing content:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="course-sequence">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3"
                    >
                        {sequence.map((item, index) => (
                            <Draggable
                                key={`${item.contentType}-${item.contentId}`}
                                draggableId={`${item.contentType}-${item.contentId}`}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`bg-white/5 backdrop-blur-md rounded-xl border ${
                                            snapshot.isDragging ? 'border-yellow-300/50' : 'border-white/10'
                                        } p-4 hover:bg-white/10 transition-all duration-300 ${
                                            snapshot.isDragging ? 'shadow-lg shadow-yellow-300/20' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center flex-1">
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="p-2 hover:bg-white/10 rounded-lg cursor-grab active:cursor-grabbing mr-2"
                                                >
                                                    <FaGripVertical className="text-white/40" />
                                                </div>
                                                <span className="w-8 h-8 flex items-center justify-center bg-yellow-300/20 rounded-full text-yellow-300 mr-4">
                                                    {index + 1}
                                                </span>
                                                <div className="flex items-center">
                                                    {item.contentType === 'video' ? (
                                                        <FaVideo className="text-yellow-300 mr-3" />
                                                    ) : (
                                                        <FaQuestionCircle className="text-yellow-300 mr-3" />
                                                    )}
                                                    <div>
                                                        <h4 className="text-white font-medium">{item.title}</h4>
                                                        <p className="text-white/40 text-sm">
                                                            {item.contentType === 'video' ? 'Video Lesson' : 'Quiz Assessment'}
                                                            {item.duration && ` • ${item.duration}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(index)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors ml-4"
                                                title="Remove from sequence"
                                            >
                                                <FaTrash className="text-red-400 hover:text-red-300 transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        {sequence.length === 0 && (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
                                <p className="text-white/60">
                                    No content in sequence. Add some content to get started.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default SequenceManager; 