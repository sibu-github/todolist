const NODE_PORT = 9001
const DB_URL = 'mongodb://localhost:27017/todolist'

var express = require('express')
var MongoClient = require('mongodb').MongoClient

// initialize the express app
var app = express()


app.get('/', (req,res)=>{
   res.send('Hello')
})

app.get('/get_tasks', (req,res)=>{
   MongoClient.connect(DB_URL, (error, db)=>{
      if(error){
         console.log(error)
         res.status(503).json({error})
         return
      } 
      var collection = db.collection('tasks')
      collection.find({}).toArray((error, results)=>{
         res.json(results)
         db.close()
      })
   })
})


app.post('/insert_task', (req,res)=>{
   MongoClient.connect(DB_URL, (error, db)=>{
      if(error){
         console.log(error)
         res.status(503).json({error})
         return
      }
      var task_desc = req.query.task_desc
      var due_date = req.query.due_date
      var status = req.query.status
      db.collection('tasks').insertOne({
         task_desc, due_date, status
      }, (err, r)=>{
         if(err){
            console.log(err)
            res.status(503).json({error: err})
            return
         }
         res.json({insert_count: r.insertedCount})
         db.close()
      }) 
   })
})





app.listen(NODE_PORT, err=>{
   if(err){
      console.log(err)
   } else {
      console.log('server started on port: '+ NODE_PORT)
   }
})