import {DefaultCrudRepository} from '@loopback/repository';
import {PlayerGameHistory, PlayerGameHistoryRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PlayerGameHistoryRepository extends DefaultCrudRepository<
  PlayerGameHistory,
  typeof PlayerGameHistory.prototype._id,
  PlayerGameHistoryRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(PlayerGameHistory, dataSource);
  }
}
