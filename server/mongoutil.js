const MongoClient = require('mongodb').MongoClient;

const dbName = 'airbnb';
const collectionName = 'listingsAndReviews';
let _client;

const setClient = (client) => {
    _client = client
}
const connect = (uri) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    client.connect((err, _) => {
        if (err) {
            console.error('MongoClient is not connected');
            _client = null;
            return
        }
        // client.db(dbName).collection(collectionName)
        // .aggregate([])
        _client = client;
    })
}

const getCountries = () => {
    return _client.db(dbName).collection(collectionName).distinct('address.country');
}

const getCountryListings = (country, callback) => {
    return _client.db(dbName).collection(collectionName)
        .aggregate([
            {
                $match: { 'address.country': country }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    summary: 1,
                    image_url: '$images.picture_url'
                }
            },
            { $limit: 10 }
        ]).toArray(callback);
}

const getListById = (id) => {
    return _client.db(dbName).collection(collectionName)
        .findOne({ _id: id }, {
            projection: {
                name: 1,
                description: 1,
                'address.location': 1
            }
        })
        .then(result => {
            return {
                id: result._id,
                name: result.name,
                description: result.description,
                location: result.address.location
            }
        })
    // return new Promise((resolve, reject) => {
    //     _client.db(dbName).collection(collectionName)
    // .aggregate([
    //     {
    //         $match: { _id: id }
    //     },
    //     {
    //         $project:
    //         {
    //             name: 1,
    //             description: 1,
    //             address: 1
    //         }
    //     }
    // ]).toArray((err, result) => {
    //     if (err)
    //         return reject(err);
    //     resolve(result);
    // })
// })
}

module.exports = { connect, getCountries, setClient, getCountryListings, getListById }