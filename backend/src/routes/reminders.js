const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require('../controllers/reminderController');

router.use(protect);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
