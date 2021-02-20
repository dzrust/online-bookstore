USE bookstore;
CREATE TABLE Book (
    isbn VARCHAR(20),
    title VARCHAR(200),
    author VARCHAR(200),
    bookDescription TEXT,
    PRIMARY KEY ( isbn )
);

CREATE TABLE BookInventory (
    id VARCHAR(36),
    isbn VARCHAR(20),
    checkedIn BOOLEAN,
    PRIMARY KEY (id)
);

CREATE TABLE BookLog (
    id VARCHAR(36),
    isbn VARCHAR(20),
    updatedDateTime DATETIME,
    messageLog TEXT,
    PRIMARY KEY ( id )
);