const models = require('../../database/models');
const { generateToken } = require('./generateToken');

exports.login = async (ctx) => {
  const { k_uid, user_info } = ctx.request.body;
  const account = await models.user.findOne({ where: { kaist_uid: k_uid } });

  const updatedAccount = {
    ku_std_no: user_info.ku_std_n || null,
    ku_employee_number: user_info.ku_employee_number || null,
    displayname: user_info.displayname || null,
    ku_acad_name: user_info.ku_acad_name || null,
    ku_kname: user_info.ku_kname || null,
  }
  if (account) {
    await models.user.update(updatedAccount, { where: { id: account.id } })

    const token = await generateToken({ id: account.id });

    ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
    ctx.body = account;
  } else {
    ctx.status = 403;
    return;
  }
};

exports.register = async (ctx) => {
  const { k_uid, user_info } = ctx.request.body;
  const userData = {
    kaist_uid: k_uid,
    ku_std_no: user_info.ku_std_n || null,
    ku_employee_number: user_info.ku_employee_number || null,
    displayname: user_info.displayname || null,
    ku_acad_name: user_info.ku_acad_name || null,
    ku_kname: user_info.ku_kname || null,
  };
  const user = await models.user.create(userData);
  const token = await generateToken({ id: user.id });

  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  ctx.body = user;
}
