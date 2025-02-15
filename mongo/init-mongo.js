db = db.getSiblingDB('mydb'); // سوئیچ به دیتابیس mydb

db.createUser({
  user: "tosan",
  pwd: "tosan-security",
  roles: [
    { role: "readWrite", db: "mydb" }
  ]
});
