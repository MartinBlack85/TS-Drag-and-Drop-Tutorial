
import { Project, ProjectStatus } from '../models/projectModel';


    // Project State Management

// Creating a custom type (not a class) for the event listener:
// encoding a function type with one word ( the event listener is only a function)
type Listener<T> = (items: T[]) => void;


// base class for the projectstate class
class State<T> {

    // setting listener property for the event listener function
    // this is an array of event listener functions
    protected listeners: Listener<T>[] = [];

    // creating an event listener function:
    addListener(listenerFunction: Listener<T>) {
        this.listeners.push(listenerFunction);
    }

}

// Project State Management Class
export class ProjectState extends State<Project> {

    private projects: Project[] = [];
    // static property for singleton design
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    // static method for singleton design
    static getInstance() {
        if(this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numberOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(), 
            title, 
            description, 
            numberOfPeople, 
            ProjectStatus.Active
            );
        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(project => project.id === projectId);
        if(project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for(const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}

// Creating a global instance of the project state class by using the singleton constructor
export const projectState = ProjectState.getInstance();



