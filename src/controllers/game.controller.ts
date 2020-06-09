import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {Game} from '../models';
import {CardMasterRepository, GameCardsDeckRepository, GameRepository, PlayerGameHistoryRepository} from '../repositories';
const lodash = require('lodash'); // vs code editor not allowing this  import * as _ from 'lodash';
const moment = require('moment');




export class GameController {
  noOfInitialCard: number = 2;
  constructor(
    @repository(GameRepository)
    public gameRepository: GameRepository,
    @repository(CardMasterRepository)
    public cardMasterRepository: CardMasterRepository,
    @repository(GameCardsDeckRepository)
    public gameCardsDeckRepository: GameCardsDeckRepository,
    @repository(PlayerGameHistoryRepository)
    public playerGameHistoryRepository: PlayerGameHistoryRepository
  ) {}

  // end point to start the game
  @post('/api/game/start', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: getModelSchemaRef(Game)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, {
            title: 'NewGame',
            exclude: ['_id'],
          }),
        },
      },
    })
    game: Omit<Game, '_id'>,
  ): Promise<Game> {
    const gameResponse = await this.gameRepository.create(game);
    // lets get 52 cards from db
    const masterCards = await this.cardMasterRepository.find();
    const firstCardGroup = lodash.shuffle(masterCards.map(({_id, ...attr}) => attr));
    // lets crate two more copy as we want deck of 52*3 cards
    const secondCardGroup = lodash.shuffle(JSON.parse(JSON.stringify(firstCardGroup)));
    const thirdCardGroup = lodash.shuffle(JSON.parse(JSON.stringify(firstCardGroup)));
    const finalCardGroup: Array<object> = [...firstCardGroup, ...secondCardGroup, ...thirdCardGroup];
    const time = moment().format('YYYY-MM-DD HH:mm:ss');

    // lets intiate initial 2 cards to each player
    const deck = this.initiateIntialCards(game, finalCardGroup, gameResponse._id);
    await this.gameCardsDeckRepository.create({game_id: gameResponse._id, cards: deck, created_at: time, updated_at: time});
    return gameResponse;
  }

  /*
      Simple function to assign intial cards to each players

  */
  initiateIntialCards(game: Omit<Game, '_id'>, deck: Array<object>, game_id: any) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    game.players.map((player_id: string) => {
      const playerCard: Array<object> = [];
      const playerObj = {player_id: player_id, game_id: game_id, cards: playerCard, created_at: time, updated_at: time};
      for (let i = 0; i < this.noOfInitialCard; i++) {
        deck = lodash.shuffle(deck);
        playerCard.push(deck[0]);
        deck.splice(0, 1);
      }
      playerObj.cards = playerCard;
      this.playerGameHistoryRepository.create(playerObj);
    });

    // lets grab initial card for dealer
    const dealerCard: Array<object> = [];
    const dealerObj = {player_id: game.dealer, game_id: game_id, cards: dealerCard, created_at: time, updated_at: time};
    for (let i = 0; i < this.noOfInitialCard; i++) {
      deck = lodash.shuffle(deck); //  we may use here hand evaluation algorithm
      dealerCard.push(deck[0]);
      deck.splice(0, 1);
    }
    dealerObj.cards = dealerCard;
    this.playerGameHistoryRepository.create(dealerObj);
    return deck;
  }

  // API to get player cards corresponding to a game
  @get('/api/game/{game_id}/playercards/{player_id}', {
    responses: {
      '200': {
        description: 'Player Card'

      },
    },
  })
  async getCards(
    @param.path.string('game_id') game_id: string,
    @param.path.string('player_id') player_id: string
  ) {
    const where = {"where": {$and: [{player_id: player_id}, {game_id: game_id}]}};
    return await this.playerGameHistoryRepository.find(where);
  }

  // API to draw a card from current deck for player
  @get('/api/game/{game_id}/deck/draw/{player_id}', {
    responses: {
      '200': {
        description: 'Draw a Card for player'

      },
    },
  })
  async drawFromDeckPlayer(
    @param.path.string('game_id') game_id: string,
    @param.path.string('player_id') player_id: string
  ) {
    const where = {"where": {game_id: game_id}};
    const currentDeck = await this.gameCardsDeckRepository.findOne(where);
    const shuffleDeck = lodash.shuffle(currentDeck?.cards);
    const gameCardId = currentDeck?._id;
    const getOldCards = await this.playerGameHistoryRepository.findOne({"where": {$and: [{player_id: player_id}, {game_id: game_id}]}});
    const newCards = getOldCards?.cards
    const id = getOldCards?._id;
    const shuffledCard = shuffleDeck[0];
    newCards?.push(shuffledCard);
    shuffleDeck.splice(0, 1);
    // lets update current game deck as player draw a card from current deck
    await this.gameCardsDeckRepository.updateById(gameCardId, {cards: shuffleDeck});
    // lets update player card history as player draw a card from current deck
    await this.playerGameHistoryRepository.updateById(id, {cards: newCards});
    return shuffledCard;
  }

  // API draw a card from current deck for dealer
  @get('/api/game/{game_id}/deck/draw/{dealer_id}', {
    responses: {
      '200': {
        description: 'Draw a Card for dealer'

      },
    },
  })
  async drawFromDeckDealer(
    @param.path.string('game_id') game_id: string,
    @param.path.string('dealer_id') dealer_id: string
  ) {
    const where = {"where": {game_id: game_id}};
    const currentDeck = await this.gameCardsDeckRepository.findOne(where);
    const shuffleDeck = lodash.shuffle(currentDeck?.cards); //  we may use here hand evaluation algorithm
    const gameCardId = currentDeck?._id;
    const getOldCards = await this.playerGameHistoryRepository.findOne({"where": {$and: [{player_id: dealer_id}, {game_id: game_id}]}});
    const newCards = getOldCards?.cards
    const id = getOldCards?._id;
    const shuffledCard = shuffleDeck[0];
    newCards?.push(shuffledCard);
    shuffleDeck.splice(0, 1);
    // lets update current game deck as player draw a card from current deck
    await this.gameCardsDeckRepository.updateById(gameCardId, {cards: shuffleDeck});
    // lets update player card history as player draw a card from current deck
    await this.playerGameHistoryRepository.updateById(id, {cards: newCards});
    return shuffledCard;
  }

  // API to
  @get('/api/game/{game_id}/deck', {
    responses: {
      '200': {
        description: 'Get all the cards from current deck'
      },
    },
  })
  async getDeck(
    @param.path.string('game_id') game_id: string
  ) {
    const where = {"where": {game_id: game_id}};
    return await this.gameCardsDeckRepository.find(where);
  }



}
