exports.getdate= function () {
    let day = {};

  var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  var today = new Date();
  day = today.toLocaleDateString("en-US", options);

  return day;
}

exports.getday=function () {
  let day = {};

  var options = {
    weekday: "long",
  };

  var today = new Date();
  day = today.toLocaleDateString("en-US", options);

  return day;
}