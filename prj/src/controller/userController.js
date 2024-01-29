const connection = require('../database/connection');
const jwt = require('../services/token');

module.exports.signup = async (req, res) => {
    try {
        let { email, password } = req.body;
        await connection.query('BEGIN')
        let result = await Pool.query('SELECT * FROM users where email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({
                message: "User already exist"
            })
        } else {
            const newUserData = await connection.query('INSERT INTO users(email , password) VALUES($1 , $2) RETURNING *', [email, password]);

            return res.status(201).json({
                message: 'User Created',
                data: newUserData.rows[0].email
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


module.exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        await connection.query('BEGIN')
        let checkUserData = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        let checkUser = checkUserData.rows[0];
        if (checkUser) {
            if (password == checkUser.password) {
                const payload = {
                    id: checkUser.id,
                    email: checkUser.email
                }
                const token = jwt.issueJWT(payload);
                return res.status(200).json({
                    message: 'User Login Successfully',
                    token: token,
                    data: {
                        userId: checkUser.id,
                        email: checkUser.email
                    }
                })
            } else {
                return res.status(400).json({
                    message: 'wrong password'
                })
            }
        } else {
            return res.status(404).json({
                message: 'This user does not exist'
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}