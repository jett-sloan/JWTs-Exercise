/** User class for message.ly */

const { query } = require("express");
const db = require("../db");
const ExpressError = require("../expressError");

/** User of the site. */

class User {
  constructor({ username,password, first_name, last_name, phone }) {
    this.username = username
    this.password = password
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
  }
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    const results = await db.query(
      `INSERT INTO users(username,password,first_name,last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING username`
      ,[username,password,first_name,last_name,phone]
      
    )
    return results.rows[0].username;
   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const results = db.query(
      `SELECT * FROM user WHERE username = $1
      password = $2`,[username,password]
    )
    if(!results.rows){
      return false 
    }else{
      return true
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const results = db.query(`
    UPDATE users SET last_login_at = $1, WHERE username = $2`[new Date(),username])
    return results.rows[0].last_login_at
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const results = db.query(
      `SELECT * FROM users `
    )
    return results.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT * FROM users WHERE username = $1 `,
      [username]
    )
    const user = results.rows[0]
    return new User(user)
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { 
    const results = await db.query(`
    SELECT m.id,m.to_user,m.body,m.sent_at,m.read_at,u.username
    AS to_username,u.first_name,u.last_name,u.phone
FROM messages m
INNER JOIN users u ON m.to_user = u.username
WHERE 
    m.from_user = $1
`,[username])
return results.rows
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    const results = await db.query(`
    SELECT m.id,m.from_user,m.body,m.sent_at,m.read_at,u.username 
    AS from_username,u.first_name,u.last_name,u.phone
FROM 
    messages m
INNER JOIN 
    users u ON m.from_user = u.username
WHERE 
    m.to_user = $1
`,[username])
return results.rows
  }
}


module.exports = User;