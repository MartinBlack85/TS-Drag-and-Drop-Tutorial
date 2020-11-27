


// Component Base Class -  functioning as UI component
// every component is a renderable object with some functionalities
// for flexible functionality, this is a generic abstract class (always work through inheritance)
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
        // gives access to the element that holds the content to render
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        // holds a reference to the element where it will be rendered
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as U;

        // assign a css id and render it
        if(newElementId) {
            this.element.id = newElementId;
        }

        // calling the attach function to get the host element into the DOM
        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;
}


