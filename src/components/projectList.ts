
import { IDragTarget } from '../models/dragDropInterfaces';
import { Project, ProjectStatus } from '../models/projectModel';
import { Component } from './baseComponent';
import { autoBind } from '../decorators/autoBind';
import { projectState } from '../state/projectState';
import { ProjectItem } from './projectItem';


    // ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements IDragTarget {

    //property for registering the event listener function:
    assignedProjects: Project[];


    // adding a new property with accessor in the constructor parameter
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autoBind
    dragOverHandler(event: DragEvent) {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            // due to a javascript feature, the dragevent only allowed if the preventDefault method is used
            // by default javascript doesn§t allow drag and drop events
            event.preventDefault();
            const listElement = this.element.querySelector('ul')!;
            listElement.classList.add('droppable');
        }
    }

    @autoBind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @autoBind
    dragLeaveHandler(_event: DragEvent) {
        const listElement = this.element.querySelector('ul')!;
        listElement.classList.remove('droppable');
    }


    configure() {
        // adding the drag event listeners
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        // adding and register the event-listener for the state changes:
        projectState.addListener((projects: Project[]) => {
            // before storing the projects, they need to be filtered
            //filtering the status of projects with enums:
            const relevantprojects = projects.filter(project => {
                if(this.type === 'active') {
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantprojects;
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        // this will create the headings for that section
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        // get rid of all list items
        listElement.innerHTML = '';
        // after that re-render the list items
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
        }
    }
}


