import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    strictObjectIDCoercion: true,
    mongodb: {
      collection: 'player_game_history',
    }
  }

})
export class PlayerGameHistory extends Entity {
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
  player_id: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PlayerGameHistory>) {
    super(data);
  }
}

export interface PlayerGameHistoryRelations {
  // describe navigational properties here
}

export type PlayerGameHistoryWithRelations = PlayerGameHistory & PlayerGameHistoryRelations;
