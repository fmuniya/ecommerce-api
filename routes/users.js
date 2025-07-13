const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    registerUser, 
    loginUser } = require('../controllers/usersController');

const { authenticateToken, authorizeRole } = require('../middleware/auth');


//Admin only - get all users
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);

//Admin or user
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.post('/register', registerUser);
router.post('/login', loginUser);


module.exports = router;
