import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    mongodb: {
      collection: 'game_card_deck',
    }
  }

})
export class GameCardsDeck extends Entity {
  @property({
    type: 'object',
    id: true,
    generated: true,
  })
  _id?: object;

  @property({
    type: 'string',
    required: true,
  })
  game_id: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  cards: object[];

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;


  constructor(data?: Partial<GameCardsDeck>) {
    super(data);
  }
}

export interface GameCardsDeckRelations {
  // describe navigational properties here
}

export type GameCardsDeckWithRelations = GameCardsDeck & GameCardsDeckRelations;
