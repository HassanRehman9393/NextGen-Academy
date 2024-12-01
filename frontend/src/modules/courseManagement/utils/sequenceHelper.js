export const reorderSequence = (sequence) => {
    return sequence
        .sort((a, b) => a.order - b.order)
        .map((item, index) => ({
            ...item,
            order: index + 1
        }));
};

export const validateSequence = (sequence) => {
    if (!Array.isArray(sequence)) {
        return {
            isValid: false,
            errors: ['Invalid sequence format']
        };
    }

    const errors = [];
    const seenOrders = new Set();
    const seenContent = new Set();

    sequence.forEach((item, index) => {
        // Check for duplicate content
        const contentKey = `${item.contentType}-${item.contentId}`;
        if (seenContent.has(contentKey)) {
            errors.push(`Duplicate content at position ${index + 1}`);
        }
        seenContent.add(contentKey);

        // Check for valid order
        if (item.order <= 0 || seenOrders.has(item.order)) {
            errors.push(`Invalid or duplicate order at position ${index + 1}`);
        }
        seenOrders.add(item.order);
    });

    // Check for sequence continuity
    const orders = Array.from(seenOrders).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
        if (orders[i] !== i + 1) {
            errors.push('Sequence order is not continuous');
            break;
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const moveItem = (sequence, fromIndex, toIndex) => {
    const newSequence = [...sequence];
    const [movedItem] = newSequence.splice(fromIndex, 1);
    newSequence.splice(toIndex, 0, movedItem);
    return reorderSequence(newSequence);
}; 