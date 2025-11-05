const Curriculum = require('../models/curriculum.model');

// ============================
// GET: Fetch all curriculum data (Students & Admin)
// ============================
const getCurriculum = async (req, res) => {
  try {
    const curriculum = await Curriculum.find();
    res.status(200).json(curriculum);
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    res.status(500).json({ message: 'Server Error while fetching curriculum' });
  }
};

// ============================
// POST: Add new curriculum (Admin only)
// ============================
const addCurriculum = async (req, res) => {
  try {
    const { semester, subjectName, subjectCode, description } = req.body;

    if (!semester || !subjectName || !subjectCode) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newCurriculum = new Curriculum({
      semester,
      subjectName,
      subjectCode,
      description,
    });

    await newCurriculum.save();
    res.status(201).json({ message: 'Curriculum added successfully', curriculum: newCurriculum });
  } catch (error) {
    console.error('Error adding curriculum:', error);
    res.status(500).json({ message: 'Server Error while adding curriculum' });
  }
};

// ============================
// PUT: Update a curriculum (Admin only)
// ============================
const updateCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Curriculum.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: 'Curriculum not found' });

    res.status(200).json({ message: 'Curriculum updated successfully', updated });
  } catch (error) {
    console.error('Error updating curriculum:', error);
    res.status(500).json({ message: 'Server Error while updating curriculum' });
  }
};

// ============================
// DELETE: Remove a curriculum (Admin only)
// ============================
const deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Curriculum.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Curriculum not found' });

    res.status(200).json({ message: 'Curriculum deleted successfully' });
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    res.status(500).json({ message: 'Server Error while deleting curriculum' });
  }
};

module.exports = {
  getCurriculum,
  addCurriculum,
  updateCurriculum,
  deleteCurriculum,
};
