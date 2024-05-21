import { Schema } from '@interfaces/schema.interface';
import { ILoggedUser } from '@interfaces/user.interface';
import { IRole, ISegment, ISegments } from '@interfaces/index';
import Realm from 'realm';

export class LoggedUser extends Realm.Object<ILoggedUser> {
  id: number;
  userId: string;
  name: string;
  mobile: string | null;
  email: string | null;
  maxMasters: number | null;
  maxUsers: number | null;
  partnershipPercentage: number | null;
  minBrokerage: number | null;
  masterMarginUserNseFut: number | null;
  maxMarginUserNseFut: number | null;
  orderBetweenHighLow: boolean | null;
  isLimitAllow: boolean | null;
  isApplyAutoSquareOff: boolean | null;
  editTrade: boolean | null;
  deleteTrade: boolean | null;
  manualTrade: boolean | null;
  maxLotUserMcx: number | null;
  masterLotMcx: number | null;
  maxLotUserNseOption: number | null;
  masterLotUserNseOption: number | null;
  isActive: boolean;
  roleId: number | null;
  parentId: number | null;
  otherM2mAlert: number | null;
  otherM2mPercentage: number | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  totalMyUsers: number | null;
  role: Role;
  isCurrentLoggedIn: boolean;
  Cookie: string;
  segments: Segments[];
  alertSound: boolean;
  rememberMe: boolean;
  balance: number | null;
  changePasswordRequire: boolean | null;
  isNseOptionSell: boolean | null;

  public static schema: Schema<ILoggedUser> = {
    name: 'LoggedUser',
    primaryKey: 'id',
    properties: {
      id: 'int',
      userId: 'string',
      name: 'string',
      mobile: 'string?',
      email: 'string?',
      maxMasters: 'int?',
      maxUsers: 'int?',
      partnershipPercentage: 'int?',
      minBrokerage: 'int?',
      masterMarginUserNseFut: 'int?',
      maxMarginUserNseFut: 'int?',
      orderBetweenHighLow: 'bool?',
      isLimitAllow: 'bool?',
      isApplyAutoSquareOff: 'bool?',
      editTrade: 'bool?',
      deleteTrade: 'bool?',
      manualTrade: 'bool?',
      maxLotUserMcx: 'int?',
      masterLotMcx: 'int?',
      maxLotUserNseOption: 'int?',
      masterLotUserNseOption: 'int?',
      isActive: 'bool',
      roleId: 'int?',
      parentId: 'int?',
      otherM2mAlert: 'int?',
      otherM2mPercentage: 'int?',
      createdBy: 'int?',
      updatedBy: 'int?',
      createdAt: 'date?',
      updatedAt: 'date?',
      deletedAt: 'date?',
      totalMyUsers: 'int?',
      role: 'Role',
      isCurrentLoggedIn: 'bool',
      Cookie: 'string',
      segments: 'Segments[]',
      alertSound: 'bool',
      rememberMe: 'bool',
      balance: 'float?',
      changePasswordRequire: 'bool?',
      isNseOptionSell: 'bool?',
    },
  };

  static all(realm: Realm): Realm.Results<LoggedUser> {
    return realm
      .objects<LoggedUser>(LoggedUser.schema.name)
      .filtered('isCurrentLoggedIn != true');
  }

  static getActiveUser(realm: Realm): LoggedUser | null {
    const instances: Realm.Results<LoggedUser> = realm
      .objects<LoggedUser>(LoggedUser.schema.name)
      .filtered('isCurrentLoggedIn == true');

    if (instances && instances.length > 0) {
      return instances[0];
    }
    return null;
  }

  static getById(realm: Realm, userId: string): LoggedUser | null {
    const instances: Realm.Results<LoggedUser> = realm
      .objects<LoggedUser>(LoggedUser.schema.name)
      .filtered('userId == $0', userId);

    if (instances && instances.length > 0) {
      return instances[0];
    }
    return null;
  }

  static create(obj: ILoggedUser, realm: Realm) {
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const instances: LoggedUser[] = [];
          const instance = realm.create<ILoggedUser>(
            LoggedUser.schema.name,
            obj,
            Realm.UpdateMode.Modified,
          ) as unknown as LoggedUser;
          instances.push(instance);

          resolve(instances);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static setAsCurrentUser(id: number, realm: Realm) {
    return new Promise((resolve, reject) => {
      try {
        let instances = realm.objects<LoggedUser>(LoggedUser.schema.name);
        if (instances && instances.length > 0) {
          realm.write(() => {
            instances.forEach(instance => {
              Object.assign(instance, {
                isCurrentLoggedIn: instance.id === id,
              });
            });
          });
        }
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static setUserProperty(obj: ILoggedUser, realm: Realm) {
    return new Promise((resolve, reject) => {
      try {
        let instances = realm
          .objects<LoggedUser>(LoggedUser.schema.name)
          .filtered('isCurrentLoggedIn == true');
        if (instances && instances.length > 0) {
          realm.write(() => {
            instances.forEach(instance => {
              Object.assign(instance, obj);
            });
          });
        }
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static clearAllCookies(realm: Realm) {
    return new Promise((resolve, reject) => {
      try {
        let instances = realm.objects<LoggedUser>(LoggedUser.schema.name);
        if (instances && instances.length > 0) {
          realm.write(() => {
            instances.forEach(instance => {
              Object.assign(instance, {
                Cookie: '',
              });
            });
          });
        }
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static delete(id: number, realm: Realm) {
    return new Promise((resolve, reject) => {
      try {
        const instance = realm.objectForPrimaryKey<LoggedUser>(
          LoggedUser.schema.name,
          id,
        );
        if (instance) {
          realm.write(() => {
            realm.delete(instance);
          });
        }
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
export class Role extends Realm.Object<IRole> {
  id: number;
  name: string;
  slug: string;
  public static schema: Schema<IRole> = {
    name: 'Role',
    embedded: true,
    properties: {
      id: 'int',
      name: 'string',
      slug: 'string',
    },
  };
}

export class Segments extends Realm.Object<ISegments> {
  id: number;
  segmentId: number;
  marginType: string;
  segment: Segment;

  public static schema: Schema<ISegments> = {
    name: 'Segments',
    properties: {
      id: 'int',
      segmentId: 'int',
      marginType: 'string',
      segment: 'Segment',
    },
  };
}

export class Segment extends Realm.Object<ISegment> {
  id: number;
  name: string;
  slug: string;
  refSlug: string;

  public static schema: Schema<ISegment> = {
    name: 'Segment',
    properties: {
      id: 'int',
      name: 'string',
      slug: 'string',
      refSlug: 'string',
    },
  };
}
