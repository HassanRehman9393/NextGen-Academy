const Video = require('../../videos/models/videoModel');
const Quiz = require('../../quizzes/models/quizModel');

class SequenceUtils {
    static async validateContent(sequence, instructorId) {
        const errors = [];
        const seenOrders = new Set();

        for (const item of sequence) {
            // Check for duplicate orders
            if (seenOrders.has(item.order)) {
                errors.push(`Duplicate order number: ${item.order}`);
                continue;
            }
            seenOrders.add(item.order);

            // Validate content ownership
            const Model = item.contentType === 'video' ? Video : Quiz;
            const content = await Model.findById(item.contentId);

            if (!content) {
                errors.push(`${item.contentType} with ID ${item.contentId} not found`);
                continue;
            }

            const contentOwner = content.instructor || content.uploadedBy;
            if (contentOwner.toString() !== instructorId.toString()) {
                errors.push(`You don't own this ${item.contentType}: ${item.contentId}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static reorderSequence(sequence) {
        return sequence
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({
                ...item,
                order: index + 1
            }));
    }

    static validateOrder(sequence) {
        const orders = sequence.map(item => item.order);
        const uniqueOrders = new Set(orders);
        return orders.length === uniqueOrders.size;
    }
}

module.exports = SequenceUtils; 