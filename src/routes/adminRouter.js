const {Router} = require('express');
const {
    getAdminByEmailHandler, 
    getAdminHandler,
    createNewAdminHandler,
    getLoginAccess,
    //getAdminByIdHandler, 
    //deleteAdminHandler, 
    //updateAdminHandler
} = require('../handlers/adminHandler');

const adminRouter = Router();
adminRouter.post('/login', getLoginAccess);
adminRouter.get('email/:email', getAdminByEmailHandler);
adminRouter.get('/', getAdminHandler);
adminRouter.post('/', createNewAdminHandler);

module.exports = adminRouter;