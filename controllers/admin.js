const Admin = require("../model/Admin");
const sequelize = require("../util/database");
async function makeAdmin(req, res, next) {
  const t = await sequelize.transaction();
  const userId = req.query.userId;
  const gpId = req.query.gpId;
  console.log("gpId in controller of making admin",gpId)
  try {
    await Admin.create(
      {
        userId: userId,
        groupchatId: gpId,
      },
      { transaction: t }
    );
    await t.commit();
    res.json({
      success: true,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
}

async function removeAdmin(req, res, next) {
  const gpId = req.query.gpId;
  const userId = req.query.userId;
  const t = await sequelize.transaction();

  try {
    const adminRecord = await Admin.findOne({
      where: {
        userId: userId,
        groupchatId: gpId,
      },
    });
    await adminRecord.destroy({ transaction: t });
    await t.commit();
    res.json({
      success: true,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
}
module.exports = {
  makeAdmin: makeAdmin,
  removeAdmin: removeAdmin,
};
