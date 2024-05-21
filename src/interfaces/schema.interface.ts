import { RealmSchema } from '@db/schemas/lib/realm.schema.types';
import {
  EntityName,
  EntityNameOpt,
  EntityNameList,
} from '@db/schemas/lib/realm.entities';

export interface Schema<TEntity extends object>
  extends RealmSchema<
    TEntity,
    EntityName,
    EntityName | EntityNameOpt | EntityNameList
  > {}
