// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = "https://fdnd-agency.directus.app/items/"
const apiItem = (apiUrl + 'oba_item')
const apiUser = (apiUrl + 'oba_profile')


// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8001)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

app.get('/', function (request, response) {
    fetchJson(apiUser).then((apiUser) => {
        response.render('user_select',{
            apiUser: apiUser.data
        })
    })
})

app.get('/home', function (request, response) {
    fetchJson(apiItem).then((items) => {
        response.render('homepage',{
            items: items.data,
            data: items.data,
        })
    })
})

app.get('/home/:id', function(request, response){
    const userId = request.params.id;
    Promise.all([
        fetchJson(apiUser + `?filter={"id":${userId}}`),
        fetchJson(apiItem)
    ]).then(([userResponse, itemsResponse]) => {
        const user = userResponse.data[0];
        const items = itemsResponse.data;        
        response.render('homepage', {
            data: items,
            user: user,
            profileName: user ? user.name : 'gebruiker'
        });
        
    });
});


app.get('/favorieten/:id', function(request, response) {
    const userId = request.params.id;
    fetchJson(apiUser + `/${userId}?fields=*,linked_item.oba_item_id.*`).then((userData) => {
        response.render('favorieten', { data: userData.data });
    });
});



app.get('/home/detail/:id', function(request, response){
    fetchJson(apiItem + '?filter={"id":' + request.params.id + '}').then((items) => {
        response.render('detail', {
            items: items.data
        });
    })
})