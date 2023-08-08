import express from 'express';
import { dbtask } from '../model/dbtask';
const Joi = require('joi');
const router = express.Router();

router.get('/listTask', listTaskShcema, listTask);
router.post('/addTask',addTaskShcema, addTask);
router.post('/updateTask', updateTaskShcema, updateTask);

module.exports = router;

//List Task validation schema
function listTaskShcema(req: any, res: any, next: any) {
    const Joischema = Joi.object({
        filter_name: Joi.string().valid('status','user_id','').default(''),
        filter_value: Joi.when('filter_name', {
            is: 'status',
            then: Joi.string().valid('Todo', 'InProgress', 'Completed').label('status').required(),
            otherwise: Joi.number().integer().label('user_id').required()
        }),
        searchstring: Joi.string().allow('').max(50)
    });

    const validationResult = Joischema.validate(req.body)
    if (validationResult.error) {
        return res.send(validationResult.error.details[0].message);
    }
    next();
}

//list task
async function listTask(req: any, res: any) {
    let taskObj = new dbtask();
    let result:any[] = await taskObj.listTask(req.body.filter_name, req.body.filter_value, req.body.searchstring);

    if(result.length == 0){
        res.send({status:0, message:'NO task found'})
    }else{
        res.send({status:1, message:'', data: result})
    }
}

//add new Task validation schema
function addTaskShcema(req: any, res: any, next: any) {
    const Joischema = Joi.object({
        name: Joi.string().max(50).required(),
        status: Joi.string().valid('Todo','InProgress','Completed').default('Todo').required(),
        user_id: Joi.number().integer().greater(0).required()
    });

    const validationResult = Joischema.validate(req.body)
    if (validationResult.error) {
        return res.send(validationResult.error.details[0].message);
    }
    next();
}

//add new task
async function addTask(req: any, res: any) {
    let taskObj = new dbtask();
    let result:any = await taskObj.createTask(req.body.name, req.body.status, req.body.user_id);
    if (result.error) {
        res.send({ status: 0, message: result.message });
    } else {
        res.send({ status: 1, message: result.message, data: result.data })
    }
}

//Update Task validation schema
function updateTaskShcema(req: any, res: any, next: any) {
    const Joischema = Joi.object({
        task_id: Joi.number().integer().greater(0).required(),
        status: Joi.string().valid('Todo','InProgress','Completed').default('Todo').required(),
        user_id: Joi.number().integer().greater(0).required()
    });

    const validationResult = Joischema.validate(req.body)
    if (validationResult.error) {
        return res.send(validationResult.error.details[0].message);
    }
    next();
}

//update existing task
async function updateTask(req:any, res:any){
    let taskObj = new dbtask();
    let result:any = await taskObj.updateTask(req.body.task_id, req.body.user_id, req.body.status)
    if(result.error){
        res.send({status:0, message: result.message})
    }else{
        res.send({status:1 , message:result.message})
    }
}