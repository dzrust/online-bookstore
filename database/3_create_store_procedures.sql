USE bookstore;
delimiter //

CREATE PROCEDURE create_book(IN isbn VARCHAR(20), IN title VARCHAR(200), IN author VARCHAR(200), IN bookDescription TEXT)
	BEGIN
	   INSERT INTO Book (isbn, title, author, bookDescription)
	   VALUES (isbn, title, author, bookDescription);
	   CALL create_book_log (isbn, 'Created book');
	END//

CREATE PROCEDURE read_book(IN isbn VARCHAR(20))
	BEGIN
		SELECT 
			b.isbn, b.title, b.author, b.bookDescription
		FROM
			Book b
		WHERE
			b.isbn = isbn;
	END//

CREATE PROCEDURE update_book(
    IN isbn VARCHAR(20),
    IN title VARCHAR(200),
    IN author VARCHAR(200),
    IN bookDescription TEXT
)
	BEGIN
		UPDATE Book b
			SET b.title=title, b.author=author, b.bookDescription=bookDescription
		WHERE b.isbn = isbn;
		CALL create_book_log (isbn, CONCAT('Updated: book title - "', title, '" book author - "', author, '" book description - "', bookDescription, '"'));
	END//

CREATE PROCEDURE delete_book(IN isbn VARCHAR(20))
	BEGIN
	   DELETE FROM Book b WHERE b.isbn = isbn;
	   DELETE FROM BookInventory bi WHERE bi.isbn = isbn;
	   DELETE FROM BookLog bl WHERE bl.isbn = isbn;
	END//

CREATE PROCEDURE read_all_books(searchText VARCHAR(200))
	BEGIN
		SELECT 
			b.isbn, b.title, b.author
		FROM
			Book b
        WHERE
            b.isbn LIKE searchText OR b.title LIKE searchText OR b.author LIKE searchText OR searchText IS NULL;
	END//

CREATE PROCEDURE create_book_log(IN isbn VARCHAR(20), IN messageLog TEXT)
	BEGIN
		INSERT INTO BookLog
			(id, isbn, updatedDateTime, messageLog)
		VALUES
			(uuid(), isbn, now(), messageLog);
	END//

CREATE PROCEDURE read_book_log(IN isbn VARCHAR(20))
	BEGIN
		SELECT
			bl.id, bl.updatedDateTime, bl.messageLog
		FROM
			BookLog bl
		WHERE bl.isbn = isbn
		ORDER BY bl.updatedDateTime DESC;
	END//

CREATE PROCEDURE create_book_inventory(IN isbn VARCHAR(20))
	BEGIN
		INSERT INTO BookInventory
			(id, isbn, checkedIn)
		VALUES
			(uuid(), isbn, 1);
		CALL create_book_log (isbn, 'Added copy of book');
	END//

CREATE PROCEDURE read_book_inventory(IN isbn VARCHAR(20))
	BEGIN
		SELECT
			bi.id, bi.checkedIn
		FROM
			BookInventory bi
		WHERE bi.isbn = isbn;
	END//

CREATE PROCEDURE update_book_inventory(IN id VARCHAR(36), IN checkedIn BOOLEAN, IN isbn VARCHAR(20))
	BEGIN
		UPDATE BookInventory bi
			SET bi.checkedIn = checkedIn
		WHERE bi.id = id;

		IF checkedIn THEN
			CALL create_book_log (isbn, CONCAT('Checked In: ', id));
		ELSE
			CALL create_book_log (isbn, CONCAT('Checked out: ', id));
		END IF;
	END//

CREATE PROCEDURE delete_book_inventory(IN id VARCHAR(36), IN isbn VARCHAR(20))
	BEGIN
		DELETE FROM BookInventory bi WHERE bi.id = id;
		CALL create_book_log (isbn, CONCAT('Removed book from inventory: ',  id));
	END//

CREATE PROCEDURE read_book_report()
	BEGIN
		SELECT b.isbn, b.title, b.author, bi.id, bi.checkedIn
		FROM Book b
		LEFT JOIN BookInventory bi
		ON b.isbn = bi.isbn;
	END//