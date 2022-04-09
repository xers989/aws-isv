const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();
const mongodb = process.env.MONGODB;
const databasename = process.env.DATABASE;
const connectionString = mongodb;
      

const client = new MongoClient(connectionString);
const database = client.db(databasename);
const handson = database.collection("handson");

router.route('/like').post(async (req, res, next) => {
    try{
        await client.connect();
       
        let query = "";
        if (req.query.ssn != null) {
            let _ssn = req.query.ssn;
            query = {ssn: {$regex: "/*"+_ssn+"/*"}};
        }
        else
        {
            query = {};
        }

        console.log('query:'+JSON.stringify(query));

        const cursor = await handson.find(query);
        const results = await cursor.toArray();

        let outcomes = '';
        if (results.length > 0) {
            results.forEach((result, i) => {
                outcomes += JSON.stringify(result);
                console.log(result);
            });
        } else {
            console.log('No Data');
        }

        console.log("Outcomes : "+outcomes);
        res.status(200).json(results);
    }catch (err)
    {
        console.error(err);
        next(err);
    } 
});

router.route('/:ssn').get( async(req, res, next) => {
    try{
        await client.connect();
        
        let _ssn = req.params.ssn;

        let query = {};
        if (_ssn != null)
            query = {ssn: _ssn} 
        const cursor = await handson.find(query);
        const results = await cursor.toArray();

        let outcomes = '';
        if (results.length > 0) {
            results.forEach((result, i) => {
                outcomes += JSON.stringify(result);
                console.log(result);
            });
        } else {
            console.log('No Data');
        }

        console.log("Outcomes : "+outcomes);
        res.status(200).json(results);

    } catch(e)
    {
        console.log("Error");
        console.error(e);
        res.status(404).json({});

    }
    finally{
        await client.close();
    }    
}).delete(async (req, res, next) => {
    try{
        await client.connect();
        
        let _ssn = req.params.ssn;
        
        let query = {};
        if (_ssn != null)
            query = {ssn: _ssn} 
            
        const result = await handson.deleteOne(
            query
          );

        console.log("Delete log"+_ssn);
        res.status(201).json(result);
    }catch (err)
    {
        console.error(err);
        next(err);
    } 
}).patch(async (req, res, next) => {
    try{
        await client.connect();
        
        let _ssn = req.params.ssn;
        
        const exampleDocument = req.body;
        let query = {};
        if (_ssn != null)
            query = {ssn: _ssn} 
            
        await handson.updateOne(
            query,
            { $set: exampleDocument }
            );

        console.log("Update log"+_ssn);
        res.status(201).json(exampleDocument);
    }catch (err)
    {
        console.error(err);
        next(err);
    } 
});

router.route('/').get( async(req, res, next) => {
    try{
        await client.connect();
        
        let query = {};

        console.log(query)

        const cursor = await handson.find(query);
        
        const results = await cursor.toArray();
        let outcomes = '';
        if (results.length > 0) {
            results.forEach((result, i) => {
                outcomes += JSON.stringify(result);
                console.log(result);
            });
        } else {
            console.log('No Data');
        }

        console.log("Outcomes : "+outcomes);
        res.status(200).json(results);

    } catch(e)
    {
        console.log("Error");
        console.error(e);
        res.status(404).json({});

    }
    finally{
        await client.close();
    }    
})
.post(async (req, res, next) => {
    console.log("Request:"+ JSON.stringify(req.body));
    try{
        await client.connect();
        const exampleDocument = req.body;
        
        await handson.insertOne(exampleDocument
          );

        res.status(201).json(exampleDocument);
    }catch (err)
    {
        console.error(err);
        next(err);
    } 
});

module.exports = router;