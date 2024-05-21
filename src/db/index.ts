import Realm from 'realm';
import { createRealmContext } from '@realm/react';
import {
  LoggedUser,
  Role,
  Segment,
  Segments,
} from '@db/schemas/loggedUser.model';

console.log(
  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n',
  'Realm db location :\n',
  Realm.defaultPath,
  '\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n',
);

export const realmConfig: Realm.Configuration = {
  schema: [Role, LoggedUser, Segments, Segment],
  schemaVersion: 5,
};

export const realmContext = createRealmContext(realmConfig);
