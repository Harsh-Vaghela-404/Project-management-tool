import { queryDb } from './connection';
import { format } from 'date-fns';
import { dbusers } from './dbusers';
export class dbtask {
    table = "task";

    /**
     * Create Task for users
     * @param name 
     * @param status 
     * @param user_id 
     * @returns 
     */
    async createTask(name:string, status:string = 'Todo', user_id:number){
        
        let return_data = {
            error:true,
            message:'',
            data:[]
        }

        if(name == '' || status == '' || !user_id) { return_data.message = "Please fill required fields"; return return_data; }

        //check if user exists before assigning the task
        let usersObj = new dbusers();
        let check_exist = await  usersObj.getUserData(user_id,'id');
        if(check_exist.length == 0){
            return_data.message = 'Please ensure a valid user exists before assigning the task.'
            return return_data;
        }

        let created_date = format(new Date(), 'yyyy-MM-dd');
        
        //Insert new Task to the user
        let query = `INSERT INTO ${this.table}(name,status,created_date,user_id) VALUES('${name}','${status}','${created_date}', '${user_id}') RETURNING id`;
        let result:any = await queryDb(query);

        if(!result){
            return_data.message = "Something went wrong, Please try again later"
            return return_data;
        }

        return_data.error = false;
        return_data.message = "Task assigned successfully";
        return_data.data = result;
        return return_data;
    }

    /**
     * List, search and filter user tasks
     * @param filter_name 'status' or 'user_id'
     * @param filter_value 
     * @param searchstring 
     * @returns 
     */
    async listTask(filter_name:string, filter_value:string, searchstring:string){
        
        let query = `SELECT * FROM ${this.table} `;

        //Filter the result using status or user_id
        if(filter_name && filter_value){
            query += ` WHERE ${filter_name} = '${filter_value}' `;
        }

        //search by the task name
        if(searchstring){

            //if filter already applied then append AND else start where condition
            if(filter_value) query += ` AND `; else query+= ` WHERE `;

            query += ` name ILIKE '${searchstring}%' `;
        }

        //group by created_date
        query += ` GROUP BY created_date,id order by created_date desc`;

        let result:any = await queryDb(query);
        return result;
    }

    /**
     * update existing task
     * @param task_id 
     * @param user_id 
     * @param status 
     * @returns 
     */
    async updateTask(task_id:number, user_id:number, status:string) {
        let return_data = {
            error:true,
            message:'',
            data:[]
        }

        if(!task_id || !user_id || !status){
            return_data.message = "Please fill required fields";
            return return_data;
        }

        let query = `UPDATE ${this.table} SET user_id = ${user_id}, status = '${status}' WHERE id = ${task_id} RETURNING id`;
        let result:any = await queryDb(query);
        if(!result){
            return_data.message = "Something went wrong, Please try again later";
            return return_data;
        }

        return_data.error = false;
        return_data.message = 'Task Updated successfully';
        return_data.data = result;
        return return_data;
    }
}

