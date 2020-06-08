# game-app

This app has created using loopback4 https://loopback.io/.

Created below tables in MongoDB

1) user ==> it will store player and dealer. Below are the dummy ids

    player: 5eda1a251009a00c62a3ac0d , 5eda1a251009a00c62a3ac0e
    dealer: 5eda1a251009a00c62a3ac0f

2) game ==> it will store players who are playing the game and dealer.
3) game_card_deck ==> it will contain current card deck corresponding to a game.
4) player_game_history => it will contain player cards corresponding to a game.
5) card_master ==> it contains 52 cards and by using it i have prepared deck of 52*3.


Installation Steps=>
  1. clone github repo using https://github.com/neerajnegidev/game-app.git
  2. cd /game-app
  3. npm install
  4. create mongo database, putting db dump into /db-dump/game-app you may create DB using this dump.
  4. Do the mongo db configuration from file path game-app\src\datasources\mongo.datasource.ts
  5. npm start
  6. Open http://localhost:8080/explorer/#/  it will open implemnted API's in GUI.


