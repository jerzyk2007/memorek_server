const mongoose = require('mongoose');

const getCollectionsName = async (req, res) => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    const filteredCollectionNames = collectionNames.filter((name) => name !== "users");
    res.json(filteredCollectionNames);
};

module.exports =
    getCollectionsName;
