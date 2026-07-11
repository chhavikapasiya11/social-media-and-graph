const createApp = require('./app');

const port = process.env.PORT || 3000;
createApp().listen(port, () => console.log(`Social graph API running on port ${port}`));
