const PDFDocument = require('pdfkit-table');
const ExcelJS = require('exceljs');
const analyticsService = require('./analyticsService');

class ReportService {
    async generatePDFReport(courseId) {
        const analytics = await analyticsService.getCourseAnalytics(courseId);
        const doc = new PDFDocument();

        // Add report content
        doc.fontSize(25).text('Course Analytics Report', { align: 'center' });
        doc.moveDown();

        // Add analytics data
        const table = {
            headers: ['Metric', 'Value'],
            rows: [
                ['Total Enrollments', analytics.enrollmentCount],
                ['Completion Rate', `${(analytics.completionCount / analytics.enrollmentCount * 100).toFixed(2)}%`],
                ['Average Rating', analytics.averageRating.toFixed(2)],
                ['Total Ratings', analytics.totalRatings],
                ['Discussion Threads', analytics.discussionStats.totalThreads],
                ['Total Comments', analytics.discussionStats.totalComments],
                ['Active Participants', analytics.discussionStats.activeParticipants]
            ]
        };

        await doc.table(table);
        return doc;
    }

    async generateExcelReport(courseId) {
        const analytics = await analyticsService.getCourseAnalytics(courseId);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Course Analytics');

        // Add headers
        worksheet.columns = [
            { header: 'Metric', key: 'metric', width: 30 },
            { header: 'Value', key: 'value', width: 15 }
        ];

        // Add data
        worksheet.addRows([
            { metric: 'Total Enrollments', value: analytics.enrollmentCount },
            { metric: 'Completion Rate', value: `${(analytics.completionCount / analytics.enrollmentCount * 100).toFixed(2)}%` },
            { metric: 'Average Rating', value: analytics.averageRating.toFixed(2) },
            { metric: 'Total Ratings', value: analytics.totalRatings },
            { metric: 'Discussion Threads', value: analytics.discussionStats.totalThreads },
            { metric: 'Total Comments', value: analytics.discussionStats.totalComments },
            { metric: 'Active Participants', value: analytics.discussionStats.activeParticipants }
        ]);

        return workbook;
    }
}

module.exports = new ReportService(); 