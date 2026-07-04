const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Protects the routes
const { 
  createWorkspace, 
  getUserWorkspaces, 
  updateWorkspace, 
  deleteWorkspace 
} = require('../controllers/workspaceController');

// All workspace actions require a logged-in user
router.use(authMiddleware);

router.post('/', createWorkspace);
router.get('/', getUserWorkspaces);
router.put('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);

module.exports = router;
