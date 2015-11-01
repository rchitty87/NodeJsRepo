var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.update = function(id, name, callback, errback){
    Item.findOneAndUpdate(id, {name: name}, function(err, item) {
      if(err) {
        errback(err);
        return;
      }

      callback(item);
    });
}

exports.remove = function(id, callback, errback) {
  Item.findOneAndRemove(id, function(err, item) {
      console.log(id);
      if(err) {
        console.log('b4 errBack');
        errback(err);
        return;
      }

      console.log('b4 callback');
      callback(item);
  });
}
