const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const app = express()
let port = 3001

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and jsonwebtoken' })
})

// email, password 
app.post('/login', (request, response) => {
    //const { email, password } = request.body

    const accessToken = jwt.sign(request.body, 'CkDt7TNpw2MmfCtNb', { expiresIn: '365d' });
    response.status(200).json({
        accessToken
    });
})

app.get('/welcome', (request, response, next) => {
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'CkDt7TNpw2MmfCtNb');
    const user = decodedToken;
    console.log("decodedToken", decodedToken);

    // Fait passer les informations de l'utilisateur dans la requette
    request.auth = {
        user: user
    };
    next();
    // Fonction a executer...
    response.status(200).json('Identification confirmer' )
})


app.get('/user', (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return request.sendStatus(401);
    }
    
    let auth
    jwt.verify(token, 'CkDt7TNpw2MmfCtNb', (err, user) => {
        if (err) {
            return response.sendStatus(401);
        }
        // Recuperer les infos de l'utilisateur dans la variable user
        auth = user
        next();
    });
    response.status(200).send(`Utilisateur connecté. Authentifié : ${JSON.stringify(auth)}`)
})

app.listen(port, () => {
    console.log(`Le serveur s'exécute sur le port ${port}.`)
})