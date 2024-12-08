const analyticsService = require('../services/analyticsService');
const reportService = require('../services/reportService');

class AnalyticsController {
    async getCourseAnalytics(req, res) {
        try {
            const { courseId } = req.params;
            const analytics = await analyticsService.getCourseAnalytics(courseId);
            
            res.json({
                success: true,
                data: analytics
            });
        } catch (error) {
            console.error('Error in getCourseAnalytics controller:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async downloadPDFReport(req, res) {
        try {
            const { courseId } = req.params;
            const doc = await reportService.generatePDFReport(courseId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=analytics-${courseId}.pdf`);

            doc.pipe(res);
            doc.end();
        } catch (error) {
            console.error('Error generating PDF report:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async downloadExcelReport(req, res) {
        try {
            const { courseId } = req.params;
            const workbook = await reportService.generateExcelReport(courseId);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=analytics-${courseId}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error generating Excel report:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateAnalytics(req, res) {
        try {
            const { courseId } = req.params;
            const analytics = await analyticsService.updateAnalytics(courseId, req.body);
            
            res.json({
                success: true,
                data: analytics
            });
        } catch (error) {
            console.error('Error in updateAnalytics controller:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AnalyticsController(); 