import { Observable } from 'simple-structures';

export interface DataState<T> {
  data: Observable<T>;
}
