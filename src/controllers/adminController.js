const {Admin} = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      return { token };


   
    };
  };
        const getAllAdmins = async () => {
     
              const admins = await Admin.findAll();
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

module.exports = {
    loginAdmin,
    getAllAdmins,
    searchAdminByName,
    createNewAdmin
}
