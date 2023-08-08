create table task(
	id serial,
	name varchar(50) not null,
	status task_status not null,
	created_date varchar(10) not null default to_char(current_date,'yyyy-mm-dd'),
	user_id int,
	primary key(id),
	CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id)
);

create table users(
	id serial,
	name varchar(30) not null default '',
	email varchar(40) not null default '',
	role varchar(30) not null default '',
	department varchar(40) not null default '',
	primary key(id)
);

create type task_status as enum('Todo','InProgress','Completed');
