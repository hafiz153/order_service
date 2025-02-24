export enum RedisMessageEnum {
  TEST = 'TEST',
}

export class RedisSingleMessageType<T, U> {
  payload: T;
  return: U;
}

export class MessageDataReturn {
  [RedisMessageEnum.TEST]: RedisSingleMessageType<any, string>;
}
