import express from 'express';
import { dbusers } from '../model/dbusers';
const Joi = require('joi');

const router = express.Router();

router.get('/list', list);
router.post('/addUser', addUserShcema, addUser);

module.exports = router;

//list users 
async function list(req: any, res: any) {
    let userObj = new dbusers();
    let result:any[] = await userObj.list();

    if(result.length == 0){
        res.send({status:0, message:'NO Users found'})
    }else{
        res.send({status:1, message:'', data: result})
    }
}

//add new users validation schema
function addUserShcema(req: any, res: any, next: any) {
    const Joischema = Joi.object({
        name: Joi.string().max(30).required(),
        email: Joi.string().email().max(40).required().label('Email'),
        role: Joi.string().max(30).required(),
        department: Joi.string().max(40).required()
    });

    const validationResult = Joischema.validate(req.body)
    if (validationResult.error) {
        return res.send(validationResult.error.details[0].message);
    }
    next();
}

//add new users
async function addUser(req: any, res: any) {
    let userObj = new dbusers();
    let result:any = await userObj.addUser(req.body.name, req.body.email, req.body.role, req.body.department);
    if (result.error) {
        res.send({ status: 0, message: result.message });
    } else {
        res.send({ status: 1, message: result.message, data: result.data })
    }
}
