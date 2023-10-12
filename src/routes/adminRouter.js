const {Router} = require('express');
const {
    getAdminByEmailHandler, 
    //createAdminHandler, 
    //getAdminByIdHandler, 
    //deleteAdminHandler, 
    //updateAdminHandler
} = require('../handlers/adminHandler');

const adminsRouter = Router();

adminsRouter.get('/Login', getAdminByEmailHandler);


module.exports = adminsRouter;