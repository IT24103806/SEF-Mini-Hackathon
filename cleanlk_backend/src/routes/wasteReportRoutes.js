import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(currentDirectory, '../../data/wasteReports.json');

const allowedAreas = ['Colombo', 'Kandy', 'Kegalle', 'Gampaha', 'Galle', 'Kurunegala'];
const allowedIssueTypes = ['Uncollected Garbage', 'Overflowing Bin', 'Illegal Dumping', 'Other'];
const allowedSeverity = ['Low', 'Medium', 'High'];
const allowedStatus = ['Reported', 'In Progress', 'Resolved'];
const imageDataPattern = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const maxImageDataLength = 2_800_000;

const readReports = () => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const writeReports = (reports) =>
  fs.writeFileSync(dataFile, JSON.stringify(reports, null, 2));

const classifyPriority = (severity, status) => {
  if (status === 'Resolved') return 'RESOLVED';
  if (severity === 'High') return 'URGENT';
  if (severity === 'Medium') return 'HIGH';
  return 'NORMAL';
};

const findSimilarReports = (reports, report, excludeId = null) =>
  reports.filter(
    (candidate) =>
      candidate.id !== excludeId &&
      candidate.area === report.area &&
      candidate.issueType === report.issueType,
  );

const enrichReport = (report, reports) => ({
  ...report,
  priority: classifyPriority(report.severity, report.status),
  similarReportCount: findSimilarReports(reports, report, report.id).length,
});

function validate(body) {
  const errors = {};
  const name = body.name?.trim() || '';
  const description = body.description?.trim() || '';
  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < 2) errors.name = 'Name must contain at least 2 characters.';
  else if (name.length > 80) errors.name = 'Name must contain 80 characters or fewer.';
  if (!allowedAreas.includes(body.area)) errors.area = 'Please select a valid area.';
  if (!allowedIssueTypes.includes(body.issueType)) errors.issueType = 'Please select a valid issue type.';
  if (!description || description.length < 10) {
    errors.description = 'Description must contain at least 10 characters.';
  } else if (description.length > 500) {
    errors.description = 'Description must contain 500 characters or fewer.';
  }
  if (!allowedSeverity.includes(body.severity)) errors.severity = 'Please select a valid severity.';
  if (body.status !== undefined && !allowedStatus.includes(body.status)) {
    errors.status = 'Please select a valid status.';
  }
  if (body.date) {
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      errors.date = 'Please select a valid date.';
    } else if (body.date > today) {
      errors.date = 'Report date cannot be in the future.';
    }
  }
  if (body.imageData) {
    if (!imageDataPattern.test(body.imageData)) {
      errors.imageData = 'Please upload a JPG, PNG, or WebP image.';
    } else if (body.imageData.length > maxImageDataLength) {
      errors.imageData = 'Image must be 2 MB or smaller.';
    }
  }
  return errors;
}

router.get('/', (req, res) => {
  const allReports = readReports();
  let reports = allReports;
  const { search = '', status = '', severity = '', area = '', issueType = '' } = req.query;

  if (search.trim()) {
    const query = search.toLowerCase();
    reports = reports.filter(
      (report) =>
        report.area.toLowerCase().includes(query) ||
        report.issueType.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query),
    );
  }
  if (status) reports = reports.filter((report) => report.status === status);
  if (severity) reports = reports.filter((report) => report.severity === severity);
  if (area) reports = reports.filter((report) => report.area === area);
  if (issueType) reports = reports.filter((report) => report.issueType === issueType);

  res.json(reports.map((report) => enrichReport(report, allReports)));
});

router.get('/stats', (_req, res) => {
  const reports = readReports();
  res.json({
    total: reports.length,
    urgent: reports.filter(
      (report) => classifyPriority(report.severity, report.status) === 'URGENT',
    ).length,
    resolved: reports.filter((report) => report.status === 'Resolved').length,
    areasAffected: new Set(reports.map((report) => report.area)).size,
  });
});

router.get('/:id', (req, res) => {
  const reports = readReports();
  const report = reports.find((item) => item.id === Number(req.params.id));
  if (!report) return res.status(404).json({ message: 'Waste report not found.' });
  return res.json(enrichReport(report, reports));
});

router.post('/', (req, res) => {
  const errors = validate(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const reports = readReports();
  const similarReports = findSimilarReports(reports, req.body);
  if (similarReports.length && req.body.submitAnyway !== true) {
    return res.status(409).json({
      code: 'SIMILAR_REPORTS_FOUND',
      message: 'A similar issue has already been reported in this area.',
      similarReports: similarReports.map((report) => enrichReport(report, reports)),
    });
  }

  const report = {
    id: reports.length ? Math.max(...reports.map((item) => item.id)) + 1 : 1,
    name: req.body.name.trim(),
    area: req.body.area,
    issueType: req.body.issueType,
    description: req.body.description.trim(),
    severity: req.body.severity,
    status: req.body.status || 'Reported',
    date: req.body.date || new Date().toISOString().split('T')[0],
    imageData: req.body.imageData || '',
  };
  reports.unshift(report);
  writeReports(reports);
  return res.status(201).json(enrichReport(report, reports));
});

router.put('/:id', (req, res) => {
  const reports = readReports();
  const index = reports.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Waste report not found.' });

  const merged = { ...reports[index], ...req.body, id: reports[index].id };
  const errors = validate(merged);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }
  merged.name = merged.name.trim();
  merged.description = merged.description.trim();
  delete merged.submitAnyway;
  reports[index] = merged;
  writeReports(reports);
  return res.json(enrichReport(merged, reports));
});

router.delete('/:id', (req, res) => {
  const reports = readReports();
  const id = Number(req.params.id);
  if (!reports.some((report) => report.id === id)) {
    return res.status(404).json({ message: 'Waste report not found.' });
  }
  writeReports(reports.filter((report) => report.id !== id));
  return res.json({ message: 'Waste report deleted successfully.' });
});

export default router;
