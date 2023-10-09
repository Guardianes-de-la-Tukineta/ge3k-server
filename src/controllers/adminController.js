const {Admin} = require('../db');

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

        // Busca el usuario en la base de datos
        const admin = await Admin.findOne({ email });

        // Verifica si el admin existe
        if (!admin) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        else {
            // Verifica si el password es correcto
            const passwordMatches = await bcrypt.compare(password, admin.password);
            if (!passwordMatches) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }
            else {
                return res.status(200).json({ message: 'Bienvenido' });
            }
        }

    
};
module.exports = {
    loginAdmin
}
