const express=require("express");
const cors=require("cors");
const morgan= require("morgan");
const path=require("path");

let propertiesReader=require("properties-reader");
let propertiesPath=path.resolve(__dirname,"conf/db.properties");
let properties= propertiesReader(propertiesPath);



let dbPprefix=properties.get("db.prefix");
let dbUsername=encodeURIComponent(properties.get("db.user"));
let dbPwd=encodeURIComponent(properties.get("db.pwd"));
let dbName=properties.get("db.dbName");
let dbUrl=properties.get("db.dbUrl");
let dbParams=properties.get("db.params");
const uri=dbPprefix+dbUsername+":"+dbPwd+dbUrl+dbParams;






const {MongoClient, ServerApiVersion,ObjectId}=require("mongodb");
const client=new MongoClient(uri, {serverApi:ServerApiVersion.v1});
let db=client.db(dbName);

const app=express();
app.set('json spaces',3);
app.use(cors());
app.use(morgan("short"));

app.use(express.json());

let staticPath=path.join(__dirname,"images");
app.use(express.static(staticPath));

app.param('collectionName',function (req,res,next,collectionName){
    //console.log(collectionName)
    req.collection=db.collection(collectionName);
    return next();
});

app.get('/collections/:collectionName',function (req,res,next){
    req.collection.find({}).toArray(function(err,results){
        if(err){
            return next(err);
        }
        res.send(results);
    });
});
app.post('/collections/:collectionName',function (req,res,next){
    req.collection.insertOne(req.body,(function(err,results){
        if(err){
            return next(err);
        }
        res.send("Success in saving the order");
    }));
});
/*
app.post('/collections/:collectionName/search',function (req,res,next){
    let searchTerm=req.query.q;
    searchTerm=searchTerm.replace(/%20/g," ");
    console.log(searchTerm)
    req.collection.find({subject:{$regex:new RegExp(searchTerm)}}).toArray(function(err,results){
        if(err){
            req.collection.find({location:{$regex:new RegExp(searchTerm)}}).toArray(function(errs,resultss){
                if(errs){
                    return next(errs);
                }
                res.send(resultss);
            });
        }
        res.send(results);
    });
});*/
app.get('/collections/:collectionName/search',function (req,res,next){
    let searchTerm=req.query.q;
    let search=[];
    searchTerm=searchTerm.replace(/%20/g," ");
    req.collection.find({subject:{$regex:new RegExp(searchTerm)}}).toArray(function(err,results){
        if(err){
            return next(err);
        }
        req.collection.find({location:{$regex:new RegExp(searchTerm)}}).toArray(function(errs,resultss){
            if(errs){
                return next(errs);
            }
            search.push(results);
            search.push(resultss);
            res.send(search);

        });

    });
});
app.put('/collections/:collectionName/:id',function (req,res,next){
    req.collection.updateOne({id:req.params.id},
        {$set:req.body},
        {safe:true,multi:false},function(err,results){

        if(err){
            return next(err);
        }
        res.send(results);
        });
});


app.use(function(req,res){
   res.status(404).send("Resources not found");
});



app.listen(3000,function(){
    console.log("App started on port 3000");
})
