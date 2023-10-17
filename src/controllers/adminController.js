const {Admin} = require('../db');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

const loginAdmin = async (email,password) => {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      throw new Error('El email no existe');

    } else {
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        throw new Error('Contraseña incorrecta');
      }
      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      
      return { token, adminId: admin.id };


   
    };
  };
        const getAllAdmins = async () => {
     
              const admins = await Admin.findAll({paranoid: false});
              return admins;
           
          };
    
    
          const searchAdminByName = async (adminName) => {
      
              const results = await Admin.findAll({
                where: {
                  name: {
                    [Op.iLike]: `%${adminName}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas)
                  },
                },
              });
              return results;
        
          };
const getAdminByEmail = async (email) => {
            const admin = await Admin.findOne({ 
              where: { 
                email:{
              [Op.iLike]: `%${email}%`, //* Búsqueda inexacta (y tampoco distingue mayúsculas/minúsculas) 
            } } });
            return admin;
          };
          
const createNewAdmin = async (admin) => {  
    const {
        name,
        surname,
        email,
        password,
      } = admin;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await Admin.create({
        name,
        surname,
        email,
        password: hashedPassword,
      });

      return newAdmin;
    }
    const updateAdminById = async (id, adminData) => {

      const {
        name,
        surname,
        email,
        password,
      } = adminData;
      const admin = await Admin.findByPk(id);
      if (!admin) {
        throw new Error('Admin no encontrado');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await admin.update({
        name,
        surname,
        email,
        password: hashedPassword,
      });
    }
    const deleteAdminById = async (id) => {
      const admin = await Admin.findByPk(id);
      if (!admin) {
        throw new Error('Admin no encontrado');
      }
      await admin.destroy();
    }

const restoreAdminById = async (id) => {
  const admin = await Admin.findByPk(id, { paranoid: false });
  if (!admin) {
    throw new Error('Admin no encontrado');
  }
  await admin.restore();
} 


module.exports = {
    loginAdmin,
    getAllAdmins,
    searchAdminByName,
    getAdminByEmail,
    createNewAdmin,
    updateAdminById,
    deleteAdminById,
    restoreAdminById,
}
