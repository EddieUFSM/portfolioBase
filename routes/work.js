const express = require('express')
const router = express.Router()

const { create, workById, read, remove, update} = require('../controllers/work')
const { requireSignin, isAdmin, isAuth} = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.get('/:workId', read)
router.post('/create/:userId', requireSignin, isAdmin, isAuth, create)
router.delete('/:workId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/:workId/:userId', requireSignin, isAuth, isAdmin, update)

router.param('userId', userById)
router.param('workId', workById)

module.exports = router;