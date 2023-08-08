import { queryDb } from './connection';
export class dbusers {
    table = "users";

    /**
     * List existing users
     * @returns 
     */
    async list() {
        let query = "SELECT * FROM " + this.table;
        let result = await queryDb(query);
        return result;
    }

    /**
     * Add New user
     * @param name 
     * @param email 
     * @param role 
     * @param department 
     * @returns 
     */
    async addUser(name: string, email: string, role: string, department: string) {

        //Default return data
        let return_data: any = {
            error: true,
            message: '',
            data: []
        }

        //check if user exist with same mobile number
        let check_mobile = await this.getUserData(email, 'email');
        if (check_mobile.length > 0) { return_data.message = 'Email already exists try to use different email'; return return_data; }

        //Insert new user in users table
        let query = `INSERT INTO ${this.table}(name,email,role,department) VALUES('${name}','${email}', '${role}','${department}') RETURNING id`;
        let result = await queryDb(query);

        //if error occurred then throw error 
        if (!result) {
            return return_data;
        }

        return_data.error = false;
        return_data.message = 'User Added successfully';
        return_data.data = result;
        return return_data;
    }

    /**
     * Get the user data
     * @param value 
     * @param field 
     * @returns 
     */
    async getUserData(value: any, field: string = 'email') {
        let query = "SELECT * FROM " + this.table + " WHERE " + field + " = '" + value + "'";
        let result = await queryDb(query);
        return result;
    }
}

