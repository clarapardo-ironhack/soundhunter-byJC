
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.render('auth/login', { errorMessage: 'Inicia sesión para acceder' })
}

const checkRole = (...rolesToCheck) => (req, res, next) => {
    if (rolesToCheck.includes(req.user.role)) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'No tienes permisos' })
    }
}

module.exports = { isLoggedIn, checkRole }