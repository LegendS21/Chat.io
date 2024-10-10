
const { User } = require("../models");

const authentication = async (req, res, next) => {
    const { authorization } = req.headers
    try {
        const user = authorization.split(' ')[1]
        const finduser = await User.findOrCreate({ where: { username: user } })
        req.loginInfo = {
            id: finduser[0].id,
            username: finduser[0].username
        }
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = authentication;
