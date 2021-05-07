const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')

const { UserControllers } = require('./controllers/index')

app.use(express.json())
app.use(cookieParser())
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.set('views', 'views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.status(200).json({
        message: 'this is homepage'
    })
})

app.get('/register', UserControllers.alreadyToken, UserControllers.register)

app.get('/login', UserControllers.alreadyToken, UserControllers.login)

app.post('/register', UserControllers.createUser)

app.post('/login', UserControllers.checkLogin)


app.get('/protected', UserControllers.checkToken, UserControllers.protected)

app.get('/logout', UserControllers.logout)

app.listen(port)