const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getRecords,
  getStats,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/glucoseController');

router.use(protect);

router.get('/stats', getStats);
router.get('/', getRecords);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

module.exports = router;
