const {Router} = require('express');
const {
    getAdminByEmailHandler, 
    getAdminHandler,
    createNewAdminHandler,
    getLoginAccess,
    searchAdminByNameHandler,
    updateAdminByIdHandler,
    deleteAdminByIdHandler,
    restoreAdminByIdHandler,
} = require('../handlers/adminHandler');
const verifyToken = require('../middleware/verifyToken');

const adminRouter = Router();
adminRouter.post('/login', getLoginAccess);
adminRouter.get('/name/:name', searchAdminByNameHandler);
adminRouter.get('/email/:email', getAdminByEmailHandler);
adminRouter.get('/',verifyToken, getAdminHandler);
adminRouter.post('/',verifyToken , createNewAdminHandler);
adminRouter.put('/:id',verifyToken , updateAdminByIdHandler);
adminRouter.put('/cc/:id',verifyToken , updateAdminByIdHandler);
adminRouter.delete('/:id',verifyToken, deleteAdminByIdHandler);
adminRouter.patch('/:id',verifyToken , restoreAdminByIdHandler);

module.exports = adminRouter;