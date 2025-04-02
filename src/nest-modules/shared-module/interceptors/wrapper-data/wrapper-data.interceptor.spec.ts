import { WrapperDataInterceptor } from './wrapper-data.interceptor';
import {lastValueFrom, of} from "rxjs";

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
      interceptor = new WrapperDataInterceptor();
  });

  test('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  test('should wrapper with data key', async () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });

  test('should not wrapper when meta is present', async () => {
    const data = { data: { name: 'test' }, meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(data),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual(data);
  });
});
