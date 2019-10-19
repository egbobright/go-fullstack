const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Recipe = require('./models/recipe');

//connect to MongoDB
//included options to supress deprecation warnings
mongoose.connect('mongodb+srv://guest_user:S58MQZHfmvhEMkuV@cluster0-3zk7n.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(()=>{
        console.log('Connected to Mongo DB succesfully');
    })
    .catch((error)=>{
        console.log('Unable to connect to Mongo DB');
        console.error(error);
    }
);

//set request headers middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//set request body parser **newer version
app.use(express.json());

//get all recipes
app.get('/api/recipes', (req, res, next)=>{    
    Recipe.find().then((recipes)=>{
        res.status(200).json(recipes);
    }).
    catch((error)=>{
        res.status(400).json({error: error});
    });
});

//get one recipe
app.get('/api/recipes/:id', (req, res, next)=>{
    Recipe.findOne({_id: req.params.id}).then((recipe)=>{
        res.status(200).json(recipe);
    })
    .catch((error)=>{
        res.status(404).json({error: error});
    });

});

//add new recipe
app.post('/api/recipes', (req, res, next)=>{
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });

    recipe.save()
    .then(()=>{
        res.status(201).json({message: 'New recipe added'});
    })
    .catch((error)=>{
        res.status(400).json({error: error});
    });
});

//modify a recipe
app.put('/api/recipes/:id', (req, res, next)=>{
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
        _id: req.params.id
    });

    Recipe.updateOne({_id: req.params.id}, recipe)
    .then(()=>{
        res.status(200).json({message: 'Recipe updated succesfully'});
    })
    .catch((error)=>{
        res.status(400).json({error: error});
    })
});

//delete a recipe
app.delete('/api/recipes/:id', (req, res, next)=>{
    Recipe.deleteOne({_id: req.params.id}).then(()=>{
        res.status(200).json({message: 'Recipe deleted!'});
    })
    .catch((error)=>{
        res.status(400).json({error: error});
    });
});


module.exports = app;