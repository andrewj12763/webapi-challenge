//express import 
const express = require('express');

//database and router
const router = express.Router();
const project = require('../data/helpers/projectModel')

//error reply for 404 and 500
const sendError = (msg, res) => {
  res.status(500).json({ error: `${msg}`});
};

const missingError = res => {
  res.status(404).json({ error: 'This project does not exist'});
};

const newError = (sts, msg, res) => {
  res.status(sts).json({ error: `${msg}` })
}

//middleware


//CRUD requests
//get projects
router.get('/', (req, res) => {
  project
  .get()
  .then( project => {
    res.status(200).json({ project });
  })
  .catch( err => {
    console.log(err)
    return sendError( 'This request is unavailable at the moment', res);
  })
})

//by id
router.get('/:id', (req, res) => {
  //set ID
  const ID = req.params.id;

  project
  .get(ID)
  .then( project => {
    console.log('project', project)
    if (project === undefined) {
      return missingError(res);
    }
    else {
      res.status(200).json({ project });
    }
  })
  .catch( err => {
    console.log(err)
    return sendError( 'This request is unavailable at the moment', res );
  })
})

//get project's actions 
router.get('/:id/actions', (req, res) => {
  //set ID
  const ID = req.params.id;

  project
  .getProjectActions(ID)
  .then( project => {
    console.log('project', project)
    if (project === undefined) {
      return missingError(res);
    }
    else {
      res.status(200).json({ project });
    }
  })
  .catch( err => {
    console.log(err)
    return sendError( 'This request is unavailable at the moment', res );
  })
})

//post request
router.post('/', (req, res) => {
  //define req.body
  const { name, description} = req.body;
  const newProject = { name, description};

  //check the req body
  if( !name || !description ) { 
    return res.status(406).json({ error: 'Please provide the missing information' });
  }
  project
  .insert(newProject)
  .then( project => {
    res.status(201).json(project);
  })
  .catch( err => { 
    console.log(err)
    return sendError( 'This addition is unavailable at the moment', res )
  })
})

//update request
router.put('/:id', (req, res) => {
  //set id
  const ID = req.params.id;
  
  //define req.body
  const { name, description} = req.body;
  const newProject = { name, description};

  //check the req body
  if( !name || !description ) { 
    return res.status(406).json({ error: 'Please provide the missing information' });
  }
  project
  .update(ID, newProject)
  .then( project => {
    if (project === undefined) {
      return missingError(res);
    }
    else {
      res.status(202).json(project);
    }
  })
  .catch( err => { 
    console.log(err)
    return sendError( 'This change is unavailable at the moment', res )
  })
})

//delete request
router.delete('/:id', (req, res) => {
    //set ID
    const ID = req.params.id;

    project
    .get(ID)
    .then( project => {
      console.log('project', project)
      if (project === undefined) {
        return missingError(res);
      }
      else {
        res.status(200).json({ project });
      }
    })
    .catch( err => {
      console.log(err)
      return sendError( 'This request is unavailable at the moment', res );
    })

    project
    .remove(ID)
    .then( project => {
      if (project === undefined) {
        return missingError(res);
      }
      else {
        res.status(202).json({ project });
      }
    })
    .catch( err => {
      console.log(err)
      return sendError( 'This deletion is unavailable at the moment', res );
    })
  
})

//export
module.exports = router;