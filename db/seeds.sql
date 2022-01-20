INSERT INTO department (department_name)
VALUES ("HR")
("shipping"),
("reciving"),
("orderfill"),
("inventory control");

INSERT INTO role (title, salary, department_id)
VALUES ("picker",40000,4),
("reciever",40000,3),
("shippers",40000,2),
("quality control",60000,5),
("operators manager",85000,1)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Max","Wittner",3,NULL),
("Reigen","Arataka",2,NULL),
("Mob","Kageyama",5,3),
("Ritsu","Kageyama",4,3),
("Toichiro","Suzuki",1,NULL)