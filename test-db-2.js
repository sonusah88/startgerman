import Database from 'better-sqlite3';
const db = new Database('./sqlite.db');
const row = db.prepare("SELECT * FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE \"order\" > 100)").all();
console.log(row);
