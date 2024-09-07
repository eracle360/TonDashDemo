exports.handleError = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  };
  
  exports.notFound = (req, res, next) => {
    res.status(404).send('Page not found.');
  };
  