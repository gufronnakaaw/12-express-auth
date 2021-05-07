const bcrypt = require('bcrypt')
const fs = require('fs')
const Joi = require('joi')
const crypto = require('crypto')


const generateAuthToken = () => crypto.randomBytes(30).toString('hex')

class UserController {

    register(req, res){
        res.render('auth/register')
    }
    
    login(req, res){
        res.render('auth/login')
    }

    createUser(req, res){ 
        
        const JoiSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
            repeat_password: Joi.string().required(),
        })

        const { error, value } = JoiSchema.validate(req.body)

        if(error){
            return res.render('auth/register', {
                error: error.message
            })
        }

        const { email, username, password } = value

        try {

            // generate salt
            const salt = bcrypt.genSaltSync(10)
            const hashPassword = bcrypt.hashSync(password, salt)
            
            // read file
            const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))

            // get data by email
            const user = users.find(user => user.email == email)
            
            // check user
            if(user){
                return res.render('auth/register', {
                    error: 'email already exist'
                })
            }

            const data = {
                email,
                username,
                password: hashPassword
            }

            // push data
            users.push(data)
            
            // write data
            fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 4))

            // redirect to /login
            res.status(201).redirect('/login')

        } catch (error) {

            res.status(500).json({
                error
            })
            
        }

    }

    checkLogin(req, res){

        const JoiSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })

        const { error, value } = JoiSchema.validate(req.body)

        if(error){
            return res.render('auth/login', {
                error: error.message
            })
        }

        const { email, password } = value

        try {
            
            // get all data
            const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))

            // get data by email
            const user = users.find(user => user.email == email)

            // check user
            if(!user){
                return res.render('auth/login', {
                    error: 'user not found!'
                })
            }

            // compare password
            const compare = bcrypt.compareSync(password, user.password)

            // check compare
            if(compare){
                const token = generateAuthToken()

                res.cookie('AuthToken', token, { maxAge: 3600000 })
                res.redirect('/protected')
            } else {
                res.render('auth/login', {
                    error: 'wrong password'
                })
            }
            
        } catch (error) {
            
            res.status(500).json({
                error
            })

        }
    }

    protected(req, res){
        res.render('protected')
    }
    
    logout(req, res){
        res.clearCookie('AuthToken')
        res.redirect('/login')
    }

    checkToken(req, res, next){
        const token = req.cookies['AuthToken']
        
        if(token){
            next()
        } else {
            return res.redirect('/login')
        }
    }

    alreadyToken(req, res, next){
        const token = req.cookies['AuthToken']

        if(token){
            return res.redirect('/protected')
        } else {
            next()
        }
    }

}

module.exports = new UserController