const defectRepo = require("../repository/defectRepo");

async function getAllDefects() {
  const defects = await defectRepo.getAll();
  return defects;
}

async function getDefectById(id) {
  return await defectRepo.getById(id);
}

async function createDefect(data) {
  if (!data.defect_id) {
    throw new Error("Defect ID is required");
  }
  return await defectRepo.create(data);
}

async function updateDefect(id, data) {
  return await defectRepo.update(id, data);
}

async function deleteDefect(id) {
  return await defectRepo.remove(id);
}

module.exports = {
  getAllDefects,
  getDefectById,
  createDefect,
  updateDefect,
  deleteDefect,
};
