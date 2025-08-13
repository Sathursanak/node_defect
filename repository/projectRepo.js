const Project = require("../models/project");

async function getAll(){
  return await Project.findAll();
}

async function getById(id){
  return await Project.findByPk(id);
}

async function create(data){
  return await Project.create(data);
}

async function update(id, data){
  const project = await Project.findByPk(id);
  if(!project) return null;
  return await project.update(data);
}

async function remove(id){
  const project = await Project.findByPk(id);
  if(!project) return null;
  await project.destroy();
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
