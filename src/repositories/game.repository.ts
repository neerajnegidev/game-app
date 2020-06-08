import {DefaultCrudRepository} from '@loopback/repository';
import {Game, GameRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GameRepository extends DefaultCrudRepository<
  Game,
  typeof Game.prototype._id,
  GameRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Game, dataSource);
  }
}
