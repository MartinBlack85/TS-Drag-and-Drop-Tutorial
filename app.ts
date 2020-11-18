
// Creating autobind decorator:
// as for the descriptor: give access to the original function: functions are properties with working logic
function AutoBind(target: any, methodName: string, descriptor: PropertyDescriptor) {

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


// class to work with inputs
class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        // gives access to the element that holds the content to render
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;

        // holds a reference to the element where it will be rendered
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        // when instantiate this class, it will render a form: 
        // need to pass a pointer to the importNode function:
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;

        // assign a css id and render it
        this.element.id = 'user-input';

        // getting access to the different inputs of the element:
        // will have access to every object that is instantiated from this class
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }


    // binding method: will bind to the eventlistener
    @AutoBind
    private submitHandler(event: Event) {

        // getting access the input values and validate
        // first need to prevent default form submission (that would trigger an http request)
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }


    // adding an eventlistener by using this method:
    private configure() {

        // Solution 1. for class reference problem: the bind(this) method which is needed to refer to the class, otherwise would throw an error
        // this.element.addEventListener('submit', this.submitHandler.bind(this))

        // Solution 2. Using a binding decorator (attached above to the submitHandler function)
        this.element.addEventListener('submit', this.submitHandler)
    }


    // method to render the content:
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

}


const projectInput = new ProjectInput();