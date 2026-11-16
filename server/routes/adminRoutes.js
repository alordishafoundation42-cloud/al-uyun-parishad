const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/authMiddleware');

const adminController = require('../controllers/adminController');
const galleryController = require('../controllers/galleryController');
const settingsController = require('../controllers/settingsController');

// All admin routes are protected by Firebase Admin Token verification
router.use(verifyAdminToken);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Registration Management
router.get('/registrations', adminController.getRegistrations);
router.get('/registrations/export', adminController.exportRegistrationsCSV);
router.get('/registrations/:id', adminController.getRegistrationById);
router.put('/registrations/:id', adminController.updateRegistration);
router.delete('/registrations/:id', adminController.deleteRegistration);

// Payments & Emails
router.put('/payments/:id/verify', adminController.verifyPayment);
router.put('/payments/:id/reject', adminController.rejectPayment);
router.post('/emails/:id/resend', adminController.resendConfirmationEmail);

// Quiz Management
router.get('/quiz/leaderboard', adminController.getQuizLeaderboard);
router.get('/quiz/attempts', adminController.getQuizLeaderboard);
router.get('/quiz/questions', adminController.getQuizQuestions);
router.post('/quiz/questions', adminController.addQuizQuestion);
router.put('/quiz/questions/:id', adminController.updateQuizQuestion);
router.delete('/quiz/questions/:id', adminController.deleteQuizQuestion);
router.post('/quiz/publish-results', adminController.publishQuizResults);
router.post('/quiz/unpublish-results', adminController.unpublishQuizResults);
router.put('/quiz/settings', settingsController.updateSettings);

// Gallery Management
router.get('/gallery', galleryController.getAdminGallery);
router.post('/gallery', galleryController.addGalleryImage);
router.delete('/gallery/:id', galleryController.deleteGalleryImage);

module.exports = router;
