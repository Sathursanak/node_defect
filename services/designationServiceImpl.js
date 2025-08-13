const designationRepo = require("../repository/designationRepo");

async function getAllDesignations() {
  const designation = await designationRepo.getAll();

  return designation;
}

async function getDesignationById(id) {
  return await designationRepo.getById(id);
}

async function createDesignation(data) {
  if (!data.designation) {
    throw new Error("Designation name is required");
  }
  return await designationRepo.create(data);
}

async function updateDesignation(id, data) {
  return await designationRepo.update(id, data);
}

async function deleteDesignation(id) {
  return await designationRepo.remove(id);
}

module.exports = {
  getAllDesignations,
  getDesignationById,
  createDesignation,
  updateDesignation,
  deleteDesignation,
};
