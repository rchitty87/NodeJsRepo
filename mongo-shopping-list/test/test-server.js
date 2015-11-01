var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });

    it('should list items on GET', function(done){
    	chai.request(app)
    		.get('/items')
    		.end(function(err, res) {
				should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
    		});
    });

    it('should add an item on POST', function(done){
    	chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            });
    });

    it('should edit an item on put', function(done){
    	chai.request(app)
          .put('/items/0')
          .send({'name': 'Durian'})
          .end(function(err, res){
              should.equal(err, null);
              res.should.have.status(201);
              res.should.be.json;
              res.body.name.should.be.a('string');
              res.body.name.should.equal('Durian');
              done();
          });
    });

    it('should delete an item on delete',
     function(done){
       chai.request(app)
           .del('/items/2')
           .end(function(err, res){
              res.should.have.status(200);
              done();
           })
     },
     function(done) {
       chai.request(app)
           .del('/items/123')
           .end(function(err, res){
              res.should.have.status(400);
              done();
           });
     });
});
