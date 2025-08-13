const Designation = require("../models/designation");

async function getAll() {
  return await Designation.findAll();
}

async function getById(id) {
  return await Designation.findByPk(id);
}

async function create(data) {
  return await Designation.create(data);
}

async function update(id, data) {
  const designation = await Designation.findByPk(id);
  if (!designation) return null;
  return await designation.update(data);
}

async function remove(id) {
  const designation = await Designation.findByPk(id);
  if (!designation) return null;
  await designation.destroy();
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
