import express from 'express';

import bundleIdentifierHandler from '../controllers/bundleIdentifierHandler';

const routes = express();

routes.get('/working', (req, res) => {
    res.send('Server is up and running');
});

//API Routes
routes.get('/bundle/id/:bundle_id', bundleIdentifierHandler.read);
routes.post('/bundle/set', bundleIdentifierHandler.set);
routes.post('/bundle/bump', bundleIdentifierHandler.bump);
routes.get('/bundle/all', bundleIdentifierHandler.readAll);

export default routes;