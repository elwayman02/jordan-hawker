module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'jordan-hawker',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
