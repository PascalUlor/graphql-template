const user = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
  }, {});
  User.associate = models => {
    // associations can be defined here
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };
  return User;
};

export default user;