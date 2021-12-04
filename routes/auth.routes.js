const {Router} = require('express');
const bcrypt = require('bcryptjs');
const router = Router();

// /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = {email: 'test@gmail.com', password: '111111'};  //TODO: треба шукать в базі. Зараз заглушка
        if (candidate) {
            return res.status(400).json({ message: 'Такий користувач вже існує'})
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        // надіслати юзера в базу з прийденим емейлом і захешованим паролем
        // TODO: закінчив на 34:25
    } catch (e) {
        res.status(500).json({ message: 'Щось пішло не так' })
    }
})
module.exports = router;
