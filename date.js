//jshint esversion:6
// console.log(module)


exports.getDate  = function() {
    var today = new Date();
  
  var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

   return today.toLocaleDateString('en-US', options);

  
}

exports.getDay = function () {
    var today = new Date();
  
  var options = { weekday: 'long' };

  return today.toLocaleDateString('en-US', options);

  return day
}

// console.log(exports);

