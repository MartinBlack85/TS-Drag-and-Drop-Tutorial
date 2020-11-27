
import { Component } from './baseComponent';
import { IValidatable, validate } from '../utility/validation';
import { autoBind} from '../decorators/autoBind';
import { projectState } from '../state/projectState';


    // ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {

    // properties specific for project input
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');
        // getting access to the different inputs of the element:
        // will have access to every object that is instantiated from this class
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }

    // adding an eventlistener by using this method:
    configure() {

        // Solution 1. for class reference problem: the bind(this) method which is needed to refer to the class, otherwise would throw an error
        // this.element.addEventListener('submit', this.submitHandler.bind(this))

        // Solution 2. Using a binding decorator (attached above to the submitHandler function)
        this.element.addEventListener('submit', this.submitHandler);
    }

    // needed due to the abstract class inheritance
    renderContent() {}


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
    @autoBind
    private submitHandler(event: Event) {

        // getting access the input values and validate
        // first need to prevent default form submission (that would trigger an http request)
        event.preventDefault();
        const userInput = this.gatherUserInput();
        // using a runtime check to check the tuple if it's an array (using an Array object and the isArray method)
        if(Array.isArray(userInput)) {
            // destructuring
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearInputValues();
        }
    }
}

