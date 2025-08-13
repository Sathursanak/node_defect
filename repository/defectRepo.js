const Defect = require('../models/defect');

async function getAll() {
  return await Defect.findAll();
}

async function getById(id) {
  return await Defect.findByPk(id);
}

async function create(data) {
  return await Defect.create(data);
}

async function update(id, data) {
  const defect = await Defect.findByPk(id);
  if (!defect) return null;
  return await defect.update(data);
}

async function remove(id) {
  const defect = await Defect.findByPk(id);
  if(!defect) return null;
  await defect.destroy();
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};