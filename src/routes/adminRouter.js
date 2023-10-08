const {Router} = require('express');
const {
    getAdminByEmailHandler, 
    //createAdminHandler, 
    //getAdminByIdHandler, 
    //deleteAdminHandler, 
    //updateAdminHandler
} = require('../handlers/adminsHandler');

const adminsRouter = Router();

adminsRouter.get('/Login', getAdminsHandler);


module.exports = adminsRouter;