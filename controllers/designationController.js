const designationService = require('../services/designationServiceImpl');

async function getAll(req, res){
  try{
    const data = await designationService.getAllDesignations();
   return res.status(200).json(data)
 
  }
  catch(error){
   return res.status(500).json({message: error.message});
  }
}


async function getById(req, res) {
  try {
    const id = req.params.id;
    const data = await designationService.getDesignationById(id);
    if (!data) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json(data);
  } 
  catch(error){
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const body = req.body;
    const newData = await designationService.createDesignation(body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const updated = await designationService.updateDesignation(id, body);
    if (!updated) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const deleted = await designationService.deleteDesignation(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
