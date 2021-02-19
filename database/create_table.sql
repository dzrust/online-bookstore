CREATE TABLE Book (
    isbn VARCHAR(20),
    title VARCHAR(200),
    author VARCHAR(200)
    bookDescription VARCHAR(MAX),
    PRIMARY KEY ( isbn )
);

CREATE TABLE BookInventory (
    id VARCHAR(36),
    isbn VARCHAR(20),
    checkedIn BOOLEAN,
    PRIMARY KEY (inventoryId)
)

CREATE TABLE BookLog (
    id VARCHAR(36),
    isbn VARCHAR(20),
    updatedDateTime DATETIME,
    messageLog VARCHAR(MAX),
    PRIMARY KEY ( updateId )
);