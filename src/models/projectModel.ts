

    // using enum type for the project status:
    export enum ProjectStatus { Active, Finished };


    // Creating a dedicated project type:
    // not using custom type or interface, because we want to instantiate it
    export class Project {
        // using the shorthand way: declaring properties in the constructor as attirbutes
        constructor(
            public id: string, 
            public title: string, 
            public description: string, 
            public people: number, 
            public status: ProjectStatus
            ) {}
    }



