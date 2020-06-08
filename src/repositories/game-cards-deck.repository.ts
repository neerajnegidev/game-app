import {DefaultCrudRepository} from '@loopback/repository';
import {GameCardsDeck, GameCardsDeckRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GameCardsDeckRepository extends DefaultCrudRepository<
  GameCardsDeck,
  typeof GameCardsDeck.prototype._id,
  GameCardsDeckRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(GameCardsDeck, dataSource);
  }
}
