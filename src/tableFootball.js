const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'alanroot',
    database: 'tablefootball',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(bodyParser.json()); //Convert request body to json type;
app.use(cors({credentials: true, origin: true}))


/*
 * Api handler for GET /api/winrate/:playerName
 * It retrieves the player name from the url, search the player in the database.
 * And return the totalGame, winGame and winRate of this Player.
 */
app.get('/api/winrate/:playerName', (request, response) => {
    let playerName = formatInput(request.params.playerName);

    getPlayerWinrate(playerName).then(
    resp => {
        let totalGame = parseInt(resp[0][0]['totalGame']),
        winGame = parseInt(resp[0][0]['winGame']);
        if (totalGame) {
            response.status(200).send({'success': true, 
                                       'message': {
                                           'totalGame': totalGame,
                                           'winGame': winGame,
                                           'winRate': winGame/totalGame*100}})    
        } else {
            response.status(400).send({'success': false,
                                       'message': 'User does not exist.'})
        }
        console.log('totalgame: ', totalGame, 'wingame: ', winGame);
    }, err => {
        response.status(400).send({'success': false,
                                   'message': 'Internal Server Error.'});   
    });
});

/*
 * An async function for retriving player's game details from mysql database.
 */
async function getPlayerWinrate(playerName) {
    const connection = await pool.getConnection();
    try {
        let getPlayerWinrate = 
        `
        Select
        sum(winner) as 'winGame',
        count(id) as 'totalGame'
        FROM playerGame
        where playerName = '${playerName}';
        `
        return await connection.query(getPlayerWinrate);

    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
}

/*
 * Api handler for POST /api/play-game
 * It retrieves the game details from the frontend (candidates, winner, game description).
 * And insert the game details into the database tables.
 */
app.post('/api/play-game', (request, response) => {
    let gameDetails = {
        winners: request.body.winners,
        losers: request.body.losers,
        description: formatInput(request.body.description)
    };

    transaction(gameDetails).then(
    resp => {
        response.status(200).send({'success': true,
                                   'message': 'Match result is recorded, Thank you!'});
    }, err => {
        response.status(400).send({'success': false,
                                   'message': 'Internal Server Error'});
    });
});

/*
 * A transaction here to insert data into database.
 * Basically a game entry and several game player entries for each game.
 * Generate the gameid and record who is the winner of the game.
 */
async function transaction(gameDetails) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        let insertGameSql = `INSERT INTO games (description) VALUES ('${gameDetails.description}')`;
        const result = await connection.query(insertGameSql);
        let gameId = result[0]['insertId'];

        for (let winner of gameDetails.winners) {
            let insertWinnerSql = 
            `
            INSERT INTO playerGame (playerName, gameId, winner) 
            VALUES ('${formatInput(winner)}', ${gameId}, 1);
            `
            await connection.query(insertWinnerSql);
        }
        for (let loser of gameDetails.losers) {
            let insertLoserSql = 
            `
            INSERT INTO playerGame (playerName, gameId, winner) 
            VALUES ('${formatInput(loser)}', ${gameId}, 0);
            `
            await connection.query(insertLoserSql);
        }
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
        return true;
    }
}

/*
 * Format inputting strings, remove blanks from both sides and also lowercase the string.
 */
function formatInput(anyString) {
    return anyString.toString().trim().toLowerCase();
}

app.listen(port, (err) => {
    if (err) {
        return console.log('Internal Server Error:', err);
    }
    console.log(`Server is Listening on Port:${port}`);
});