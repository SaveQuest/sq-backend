export function Service(baseScore: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('baseScore', baseScore, target, propertyKey);
  };
}

export function MetaData(key: string, value: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(key, value, target, propertyKey);
  };
}

export function DataFilter(filterKey: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingFilters = Reflect.getOwnMetadata('dataFilters', target, propertyKey) || [];
    existingFilters.push({ filterKey, parameterIndex });
    Reflect.defineMetadata('dataFilters', existingFilters, target, propertyKey);
  };
}