import _ from 'lodash';


export function mergeResults(previous, current) {
  if (previous === undefined || previous.limit === undefined) {
    return current;
  }
  if (current.offset === (previous.limit + previous.offset)) {
    return { ...current, results: [...previous.results, ...current.results] };
  }
  return current;
}

export function updateResults(state, { query, result }) {
  const key = query.toKey();
  const res = { ...result, results: result.results.map((r) => r.id) };
  return objectLoadComplete(state, key, mergeResults(state[key], res));
}

export function invalidateResults(state) {
  return {};
}

export function objectLoadStart(state, id) {
  const object = { isLoading: true, shouldLoad: false }
  return { ...state, [id]: _.assign({}, state[id], object) };
}

export function resultLoadStart(state, query) {
  const key = query ? query.toKey() : undefined;
  return objectLoadStart(state, key);
}

export function objectLoadError(state, id, error) {
  const object = {
    isLoading: false,
    isError: true,
    shouldLoad: false,
    error
  };
  return { ...state, [id]: _.assign({}, state[id], object) };
}

export function resultLoadError(state, query, error) {
  const key = query ? query.toKey() : undefined;
  return objectLoadError(state, key, error);
}

export function objectLoadComplete(state, id, data) {
  const object = {
    ...data,
    isLoading: false,
    isError: false,
    shouldLoad: false
  }
  return { ...state, [id]: _.assign({}, state[id], object) };
}

export function objectDelete(state, id) {
  _.unset(state, id);
  return state;
}

export function resultObjects(state, result) {
  if (result.results !== undefined) {
    for (let object of result.results) {
      state = objectLoadComplete(state, object.id, object);
    }  
  }
  return state;
}
