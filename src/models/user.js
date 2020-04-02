import bcrypt from 'bcrypt';
const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    age: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  }, {});
  User.associate = models => {
    // associations can be defined here
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.beforeCreate(async user => {
    user.password = await user.generateHash();
  });

  User.prototype.generateHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  }
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }
  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    });
    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }
    return user;
  };

  return User;
};

export default user;