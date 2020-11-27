
// Creating autobind decorator:
// as for the descriptor: give access to the original method: methods are properties that hold functions
export function autoBind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {

    //getting access to the original method:
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjustedDescriptor;
}


