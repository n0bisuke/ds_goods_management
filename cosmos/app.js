'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const authParams = {
    auth:{
        user: process.env.COSMOSDB_USER,
        password: process.env.COSMOSDB_PASS,
    }
};

mongoose.connect(process.env.COSMOSDB_HOST,authParams);

const Cat = mongoose.model('Cat', { name: String });
const kitty = new Cat({ name: 'のびすけ' });
kitty.save().then(() => console.log('meow'));