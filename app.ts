
// Project State Management Class
class projectState {

    private projects: any[] = [];


    addProject(title: string, description: string, numberOfPeople: number) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            poeple: numberOfPeople
        };
        this.projects.push(newProject);
    }
}




// Create a validation function
// using an interface to define an object structure for validation
interface IValidatable {

    // supported properties, by using the ? the values are optionial (undefined)
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;

}

// Creating a function for validation: it gets a validatable object
function validate(validatableInput: IValidatable) {
    let isValid = true;     // it will turn false if one of the property checks fail
    if(validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// Creating autobind decorator:
// as for the descriptor: give access to the original method: methods are properties that hold functions
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


// ProjectList Class
class ProjectList {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;


    // adding a new property with accessor in the constructor parameter
    constructor(private type: 'active' | 'finished') {
        // gives access to the element that holds the content to render
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;

        // holds a reference to the element where it will be rendered
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        // when instantiate this class, it will render a form: 
        // need to pass a pointer to the importNode function:
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;

        // assign a css id and render it
        this.element.id = `${this.type}-projects`;

        // calling the attach function to get the host element into the DOM
        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.type}-projects-lists`;
        this.element.querySelector('ul')!.id = listId;
        // this will create the headings for that section
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'

    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }

}



// Inputs Calss
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

    // to gather and validate all the input data:
    // this function returnes a union type consist of a tuple and a void return type (nit always return a value)
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;


        // implementing the interface for validation:
        const titleValidatable: IValidatable = {
            value: enteredTitle,
            required: true
        };

        const descriptionValidatable: IValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };

        const peopleValidatable: IValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max:5
        };

        // using a configuration object for validation
        if(!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
            alert('Invalid input, please try again');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];          // the + converts the enteredPeople string input into a number
        }
    }

    // function to clear the input:
    private clearInputValues() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    // binding method: will bind to the eventlistener
    @AutoBind
    private submitHandler(event: Event) {

        // getting access the input values and validate
        // first need to prevent default form submission (that would trigger an http request)
        event.preventDefault();
        console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        // using a runtime check to check the tuple if it's an array (using an Array object and the isArray method)
        if(Array.isArray(userInput)) {
            // destructuring
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputValues();
        }
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
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');