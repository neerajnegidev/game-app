import {DefaultCrudRepository} from '@loopback/repository';
import {CardMaster, CardMasterRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CardMasterRepository extends DefaultCrudRepository<
  CardMaster,
  typeof CardMaster.prototype._id,
  CardMasterRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(CardMaster, dataSource);
  }
}
