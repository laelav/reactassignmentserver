module.exports = function (app, db) {
    const ObjectID = require('mongodb').ObjectID;

    //sending 2 nums to DB
    app.post('/sendnums/:num1/:num2', (req, res) => {
        if (!Number(req.params.num1) || !Number(req.params.num2)){
            console.log("You must enter numbers!");
            res.send({'message': "You must enter numbers!"});
        }else{
            let temp1 = Number(req.params.num1);
            let temp2 = Number(req.params.num2);
            const note = {
                num1: req.params.num1,
                num2: req.params.num2,
                addition: (temp1+temp2).toString(),
                multiply: (temp1*temp2).toString()
            };
            console.log(note);

            db.collection('Table').insertOne(note, (err, result) => {
                if (err) {
                    res.send({'error': 'An error has occurred in Post /register.'});
                } else {
                    //Send back to front.
                    console.log("Numbers added successfully");
                    res.send({'message': "Numbers added successfully"});
                }
            });

        }
    });

};
