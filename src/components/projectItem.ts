
import { IDragabble } from '../models/dragDropInterfaces';
import { Project } from '../models/projectModel';
import { Component } from './baseComponent';
import { autoBind } from '../decorators/autoBind';


    // ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements IDragabble {

    // Storing the project data in a property
    private project: Project;

    // creating a getter - servers a function
    get persons() {
        if (this.project.people === 1) {
            return ' 1 person';
        } else {
            return `${this.project.people} persons`;
        }
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    // implementing the interface drag functions
    @autoBind
    dragStartHandler(event: DragEvent) {
        // using the event object's dataTransfer property
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    // implementing the interface drag functions
    dragEndHandler(_event: DragEvent) {
        console.log('DragEnd');
    }


    configure() {
        // setting the drag event listener:
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        // reaching out to the rendered li element and set the content
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }

}

