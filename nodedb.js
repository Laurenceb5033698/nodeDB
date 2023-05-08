const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbFile = '../../sql/northwind/northwind.db';
const dbExists = fs.existsSync(dbFile);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
//ask user input
readline.question('Select Query: 1, 2, or 3.', query => {
    console.log(`Running query ${query}!`);
    run(query);
    readline.close();
});
//opening db and selecting which statment to run
function run(query) {
    if (!dbExists) {
        fs.openSync(dbFile, 'w');
    }
    if (dbExists) {
        console.log("northwind db found. opening...");
        const db = new sqlite3.Database(dbFile);

        switch (query) {
            case "1": getFinCustomers(db); break;
            case "2": getLondonEmployees(db); break;
            case "3": getProductSales(db); break;
            default:
                console.log("invalid selection!");
        }
        db.close();
    }
}
//actual db interaction
function Query(db, sql) {
    db.serialize(function () {
        db.each(sql, function (err, row) {
            console.log(row);
        });
    });
}
//Different statements
function getFinCustomers(db) {
    const sql = "SELECT * FROM Customers WHERE Country = 'Finland'";
    console.log("Finnish Customers:");
    Query(db, sql);
}
function getLondonEmployees(db) {
    const sql = "SELECT * FROM Employees Where City = 'London' AND Country = 'UK'";
    console.log("London Employees:");
    Query(db, sql);
}
function getProductSales(db) {
    const sql = "SELECT sum(Quantity*UnitPrice*(1-Discount)) FROM [Order Details] WHERE ProductID IN (SELECT ProductID FROM Products WHERE ProductName LIKE '%Tofu%')";
    console.log("Product Sales of Tofu:");
    Query(db, sql);
}