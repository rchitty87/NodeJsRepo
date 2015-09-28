var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {
	for(var i=0; i<this.items.length; ++i) {
		if(this.items[i].id == id) {
			this.items.splice(i, 1);
			return true;
		}
	}

	return false;
}

Storage.prototype.edit = function(name, id) {
	for(var i=0; i<this.items.length; ++i) {
		if(this.items[i].id == id) {
			this.items[i].name = name;
			return this.items[i];
		}
	}

	var item = {name : name, id: id};
	this.id = id + 1;
	return item;
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
	if(!req.body) {
		return res.sendStatus(400);
	}

	var item = storage.add(req.body.name);
	res.status(201).json(item);
});

app.delete('/items/:id', function(req, res){
	if(req.params.id < 0 || req.params.id > Storage.id)
		return res.sendStatus(400);

	if(storage.remove(req.params.id))
		return res.status(200).json('');
});

app.put('/items/:id', jsonParser, function(req, res) {
	if(!req.body)
		return res.sendStatus(400);

	var item = storage.edit(req.body.name, req.body.id);
	res.status(201).json(item);
});

app.listen(process.env.PORT || 8080);