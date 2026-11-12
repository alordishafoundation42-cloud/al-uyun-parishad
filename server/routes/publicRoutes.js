const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const quizController = require('../controllers/quizController');
const galleryController = require('../controllers/galleryController');
const settingsController = require('../controllers/settingsController');

// Public Settings & Gallery
router.get('/settings', settingsController.getSettings);
router.get('/gallery', galleryController.getPublicGallery);

// Registration & Status
router.post('/registrations', registrationController.createRegistration);
router.get('/registrations/status/:registrationNumber', registrationController.getRegistrationStatus);

// Quiz
router.post('/quiz/verify-child', quizController.verifyChild);
router.post('/quiz/start', quizController.startQuiz);
router.post('/quiz/submit', quizController.submitQuiz);
router.get('/quiz/results', quizController.getPublicResults);

module.exports = router;
