// MAPD713
// Assignment 1
// Group 6
// Vitalii Pielievin - 300885108
// Dmytro Andriichuk - 301132978


var SERVER_NAME = 'product-api'
var PORT = 3009;
var HOST = '127.0.0.1';
// Get counter variable
var getCount = 0;
// Post counter variable
var postCount = 0;

var restify = require('restify')

// Get a persistence engine for the products
, productsSave = require('save')('products')

// Create the restify server
, server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function () {
	console.log(`Server ${server.name} listening at ${server.url}`)
	console.log('Endpoints:')
	console.log(`           ${server.url}/products`)
	console.log(`           Method: GET, POST, DELETE`)
})

server
	// Allow the use of POST
	.use(restify.fullResponse())

	// Maps req.body to req.params so there is no switching between them
	.use(restify.bodyParser());

// Get all products in the system
// http://127.0.0.1:3009/products
server.get('/products', function (req, res, next) {
	// Find every entity within the given collection
	productsSave.find({}, function (error, products) {
	 console.log(`Received GET request /products`)
	 // Return all of the products in the system
	 res.send({ count: products.length, products })
	 console.log(`Processed Request Count => Get: ${++getCount}`)
	})
})

// Create a new product
// http://127.0.0.1:3009/products
server.post('/products', function (req, res, next) {
	// Make sure product is defined
	if (req.params.product === undefined) {
	 // If there are any errors, pass them to next in the correct format
	 return next(new restify.InvalidArgumentError('product must be supplied'))
	}
	if (req.params.price === undefined) {
	 // If there are any errors, pass them to next in the correct format
	 return next(new restify.InvalidArgumentError('price must be supplied'))
	}
	if (req.params.category === undefined) {
	 // If there are any errors, pass them to next in the correct format
	 return next(new restify.InvalidArgumentError('category must be supplied'))
	}
	var addProduct = {
	 product: req.params.product,
	 price: req.params.price,
	 category: req.params.category,
	}
    // Create the product using the persistence engine
	productsSave.create(addProduct, function (error, product) {

		// If there are any errors, pass them to next in the correct format
		if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

		// Send the user if no issues
		res.send(201, product)
		console.log(
			`Processed Request Count => Post: ${++postCount}`)
	})
})

// Delete all products in the system
// http://127.0.0.1:3009/products
server.del('/products', function (req, res, next) {
	var query = productsSave.find({}, function (error, products) {})
	// Find every entity within the given collection
	console.log(`DELETE products: Deleted all records`)
	productsSave.deleteMany(query, function (error) {
	 // If there are any errors, pass them to next in the correct format
	 if (error)
		return next(
			new restify.InvalidArgumentError(JSON.stringify(error.errors))
		)

	 // Send a 200 OK response
	 res.send(200, 'Deleted');
	 console.log(`products DELETE: Deleted all records`);
	})
})
