const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');


// Dashboard Routes

// App Routes
router.get('/dashboard',isLoggedIn,dashboardController.dashboard);
// View each note
router.get('/dashboard/item/:id',isLoggedIn,dashboardController.dashboardViewNote);
// Update note
router.put('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardUpdateNote);
// Delete note
router.delete('/dashboard/item-delete/:id',isLoggedIn,dashboardController.dashboardDeleteNote);
// Get add note page
router.get('/dashboard/add',isLoggedIn,dashboardController.dashboardAddNote);
// Post new note
router.post('/dashboard/add',isLoggedIn,dashboardController.dashboardSubmitNote);
// Get search 
router.get('/dashboard/search',isLoggedIn,dashboardController.dashboardSearch);
// POST search 
router.post('/dashboard/search',isLoggedIn,dashboardController.dashboardPostSearch);

module.exports = router;
