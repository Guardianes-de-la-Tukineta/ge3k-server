const {Router} = require('express');
const {
    getAdminByEmailHandler, 
    getAdminHandler,
    createNewAdminHandler,
    getLoginAccess,
    searchAdminByNameHandler,
    //getAdminByIdHandler, 
    //deleteAdminHandler, 
    //updateAdminHandler
} = require('../handlers/adminHandler');
const verifyToken = require('../middleware/verifyToken');

const adminRouter = Router();
adminRouter.post('/login', getLoginAccess);
adminRouter.get('/name/:name', searchAdminByNameHandler);
adminRouter.get('/email/:email', getAdminByEmailHandler);
adminRouter.get('/',verifyToken, getAdminHandler);
adminRouter.post('/', createNewAdminHandler);

module.exports = adminRouter;