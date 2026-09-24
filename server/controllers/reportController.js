const Report = require('../models/Report');
const Resource = require('../models/Resource');

// @desc    Submit a report for an inappropriate resource
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const { resourceId, reason, description } = req.body;

    if (!resourceId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resource ID, reason, and detailed description'
      });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user already reported this resource
    const existingReport = await Report.findOne({
      resource: resourceId,
      reportedBy: req.user._id,
      status: 'pending'
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a pending report for this resource.'
      });
    }

    const report = await Report.create({
      resource: resourceId,
      reportedBy: req.user._id,
      reason,
      description: description.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our admin team will investigate.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('resource', 'title subject category fileUrl uploadedBy status')
      .populate('reportedBy', 'name email college')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status / action (Admin only)
// @route   PUT /api/reports/:id
// @access  Private (Admin)
const updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, actionOnResource } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();

    // If admin chooses to remove/reject the resource directly from report review
    if (actionOnResource === 'remove' || actionOnResource === 'reject') {
      const resource = await Resource.findById(report.resource);
      if (resource) {
        resource.status = 'rejected';
        resource.rejectionReason = `Removed due to moderation report: ${report.reason} - ${adminNotes || 'Violated platform guidelines'}`;
        await resource.save();
      }
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus
};
