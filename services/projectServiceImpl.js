const Project = require("../models/project");
const projectRepo = require("../repository/projectRepo");

async function getAllProjects(){
  const project = await projectRepo.getAll();
  return Project;
}

async function getProjectById(id) {
  return await projectRepo.getById(id);  
}

async function createProject(data){
  if(!data.project){
    throw new Error("Project name is required");
  }
  return await projectRepo.create(data);
}

async function updateProject(id, data) {
  return await projectRepo.update(id, data);
}

async function deleteProject(id){
  return await projectRepo.remove(id);
}

module.exports ={
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};