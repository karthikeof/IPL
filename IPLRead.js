
    var express = require('express');
    var app = express();
    var dotenv = require('dotenv');


    var MongoClient = require('mongodb').MongoClient;
    app.get('/', async (req, res, next) => {
      res.send('Hello');
    });
    app.get('/listMatches/:teamid', async (req, res, next) => {
console.log(req.params.teamid);
dotenv.config();


            try {
                MongoClient.connect(process.env.MONGOLAB_URI,  function(err, client) {
                  // assert.equal(null, err);
                   const db = client.db('IPL');
                //Step 1: declare promise
                var myPromise = () => {
                  return new Promise((resolve, reject) => {
                 
                    db
                    .collection('match_statistics')
                    .find({
                        "$or": [{
                            team1: { $regex: '.*' + req.params.teamid + '.*',$options: 'i' }
                        }, {
                          team2: { $regex: '.*' + req.params.teamid + '.*' }
                        }]
                        
                        })
                    .limit(10)
                      .toArray(function(err, data) {
                          err 
                             ? reject(err) 
                             : resolve(data);
                        });
                  });
                };
         
                //Step 2: async promise handler
                var callMyPromise = async () => {
                   
                   var result = await (myPromise());
                   //anything here is executed after result is resolved
                   return result;
                };
          
                //Step 3: make the call
                callMyPromise().then(function(result) {
                   client.close();
                   res.json(result);
                });
             }); //end mongo client
            
            } catch (e) {
              next(e)
            }

          })

         var server = app.listen(process.env.PORT || 3000, function () {
            var host = server.address().address
            var port = server.address().port
            console.log("IPL Application listening ...", host, port)
         })
         
         