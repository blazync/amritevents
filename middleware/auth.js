const jwt=  ("jsonwebtoken")
const Users= ("../models/userModel.js")

const authenticate = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ Error: "Missing or invalid Authorization header" });
    }
    // Split "Bearer " from the token
    const token = authHeader.split(' ')[1];
    // Verify the token
    const decodedToken = jwt.verify(token, 'secretkey');
    const user = await Users.findOne({ _id: decodedToken.userId }).populate('roles');
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    // Extract role names and permissions from the user's roles
    const roles = user.roles.map(role => role.name);
    const role = roles[0];
    const permissions = user.roles.reduce((acc, role) => {
      return acc.concat(role.permissions.map(permission => permission.name));
    }, []);

    // Assign roles and permissions to req.user
    req.user = {
      ...user.toObject(),
      role,
      permissions
    };
    
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ Error: "Authentication Error" });
  }
};

module.exports = authenticate;
