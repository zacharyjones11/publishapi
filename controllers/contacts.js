const { ObjectId } = require('mongodb');
const { getDb } = require('../database');

const getAll = async (req, res) => {
  try {
    const contacts = await getDb()
      .collection('contacts')
      .find()
      .toArray();

    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve contacts' });
  }
};

const getSingle = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({
      error: 'An id query parameter is required'
    });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'The id is not valid'
    });
  }

  try {
    const contact = await getDb()
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found'
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve contact' });
  }
};

module.exports = {
  getAll,
  getSingle
};