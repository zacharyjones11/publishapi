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

const createContact = async (req, res) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'favoriteColor',
    'birthday'
  ];

  const missingFields = requiredFields.filter(
    (field) => !req.body?.[field]
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'All contact fields are required',
      missingFields
    });
  }

  const newContact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  try {
    const result = await getDb()
      .collection('contacts')
      .insertOne(newContact);

    res.status(201).json({
      id: result.insertedId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Could not create contact'
    });
  }
};

const updateContact = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'The id is not valid' });
  }

  const updatedContact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  try {
    const result = await getDb()
      .collection('contacts')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedContact }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update contact' });
  }
};

const deleteContact = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'The id is not valid' });
  }

  try {
    const result = await getDb()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};