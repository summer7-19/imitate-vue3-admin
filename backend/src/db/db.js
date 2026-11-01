import mysql2 from 'mysql2'

export const pool=mysql2.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password

})