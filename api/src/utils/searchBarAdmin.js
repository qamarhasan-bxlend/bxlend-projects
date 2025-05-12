function search(field, value, model) {
    const query = {};
    if (field) {
        if (field === 'name') {
            const [firstName, lastName] = value.split(' ');
            query['name.first'] = { $regex: `^${firstName}`, $options: 'i' }; // Case-insensitive 

            if (lastName)
                query['name.last'] = { $regex: `^${lastName}`, $options: 'i' };
        }
        else if (field === 'address' && model == 'Wallet') {
            query[field] = { $regex: `^${value}`, $options: 'i' };
        }
        else if (field === 'address') {
            const [city, pincode] = value.split(' ');
            query['address.city'] = { $regex: `^${city}`, $options: 'i' }; // Case-insensitive 

            if (pincode)
                query['address.pin_code'] = { $regex: `^${pincode}`, $options: 'i' };
        }
        else if (field == 'user' || field == 'owner' || field == 'wallets' || field == '_id' || field == 'to' || field == 'from' || field == 'id') {
            if(field == 'id')
                field = '_id'
            query[field] = value
        }
        else {
            query[field] = { $regex: `^${value}`, $options: 'i' };
        }
    }
    query['deleted_at'] = { $exists: false };
    return query
}

module.exports = search