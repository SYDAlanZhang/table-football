## Table-Football
This project is the backend api of a table football game recording system.

## Frameworks and Libraries
It is using nodeJs, mysql2, expressJS, cors and some other external libraries.

## Features
1. A POST method RESTApi to record the result of a game.
Request Json example:
```
{
    "winners": ["alan","jack"],
    "losers": ["tom", "chris"],
    "description": "This is a wonderful game."
}
```
Url:
```
http://localhost:3000/api/play-game
```
This Api would response status code 200 if database insert operations are correct,
and 400 if internal server error occurs.

2. A GET methed RESTApi to retrive a players total games, winner games and winning rate.
The response Json example:
```
{
    "success":true,
    "message":
        {
            "totalGame":15,
            "winGame":11,
            "winRate":73.33333333333333
        }
}
```
Also response status code 200 and 400 according to different situations.

## Database tables design
I am using Mysql database in this project.
In a relational database, usually we build up tables according to different entries.
In this project, we have players and games which have multiply to multiply relationship.
So, normally, I should build a table for players, a table for games and also a connection table between them.
However, in this project, a player do not need to signup and login. We do not record complex informations of each players. So, I simplify the table structures and increase the insert speed.
You could find table structures from 'db.sql' file.
