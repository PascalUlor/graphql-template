const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: {
      type: DataTypes.STRING,
    },
  }, {});
  Message.associate = models => {
    // associations can be defined here
    Message.belongsTo(models.User);
  };
  return Message;
};

export default message;