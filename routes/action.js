//express import 
const express = require('express');

//database and router
const router = express.Router();
const actions = require('../data/helpers/actionModel')

//error reply for 404 and 500 and all others
const sendError = (msg, res) => {
  res.status(500).json({ error: `${msg}`});
};

const missingError = res => {
  res.status(404).json({ error: 'This action does not exist'});
};

const newError = (sts, msg, res) => {
  res.status(sts).json({ error: `${msg}` })
}

//middleware
const charLimit = (req, res, next) =>{
  let string = req.body.description;

  if(string.length > 128) {
    return newError(413, 'Text length is too long, please stick to 128 characters!', res);
  }
  else{
    next();
  }
}

//CRUD requests
//get actions
router.get('/', (req, res) => {
  actions
  .get()
  .then( action => {
    res.status(200).json({ action });
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

  actions
  .get(ID)
  .then( action => {
    console.log('action', action)
    if (action === undefined) {
      return missingError(res);
    }
    else {
      res.status(200).json({ action });
    }
  })
  .catch( err => {
    console.log(err)
    return sendError( 'This request is unavailable at the moment', res );
  })
})

//post request
router.post('/', charLimit, (req, res) => {
  //define req.body
  const { notes, description, project_id } = req.body;
  const newAction = { notes, description, project_id };

  //check the req body
  if( !notes || !description || !project_id ) { 
    return res.status(406).json({ error: 'Please provide the missing information' });
  }
  actions
  .insert(newAction)
  .then( action => {
    res.status(201).json(action);
  })
  .catch( err => { 
    console.log(err)
    return sendError( 'This addition is unavailable at the moment', res )
  })
})

//update request
router.put('/:id', charLimit, (req, res) => {
  //set id
  const ID = req.params.id;
  
  //define req.body
  const { notes, description, project_id } = req.body;
  const newAction = { notes, description, project_id };

  //check the req body
  if( !notes || !description || !project_id ) { 
    return res.status(406).json({ error: 'Please provide the missing information' });
  }
  actions
  .update(ID, newAction)
  .then( action => {
    if (action === undefined) {
      return missingError(res);
    }
    else {
      res.status(202).json(action);
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

    actions
    .get(ID)
    .then( action => {
      console.log('action', action)
      if (action === undefined) {
        return missingError(res);
      }
      else {
        res.status(200).json({ action });
      }
    })
    .catch( err => {
      console.log(err)
      return sendError( 'This request is unavailable at the moment', res );
    })

    actions
    .remove(ID)
    .then( action => {
      if (action === undefined) {
        return missingError(res);
      }
      else {
        res.status(202).json({ action });
      }
    })
    .catch( err => {
      console.log(err)
      return sendError( 'This deletion is unavailable at the moment', res );
    })
  
})


//export
module.exports = router;