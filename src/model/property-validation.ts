export interface PropertyValidation<T> {
    propName: keyof T;
    propType: string;
    checkProp?: (prop: any) => boolean;
}