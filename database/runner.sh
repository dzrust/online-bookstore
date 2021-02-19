#!/bin/bash
for filename in $(grep -rl "*.sql") do
    echo "Running: $filename"
    mysql -u root -p bookstore < $filename
done