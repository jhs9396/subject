
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class GraphInput {
    name?: string;
}

export class OrganizationInput {
    name?: string;
    location?: string;
    phoneNo?: number;
}

export class WorkerInput {
    name?: string;
    organization?: string;
    age?: number;
    gender?: string;
}

export class Node {
    label?: string;
    name?: string;
    radius?: number;
    color?: string;
}

export class Edge {
    source?: string;
    target?: string;
}

export class GraphOutput {
    nodes?: Node[];
    edges?: Edge[];
}

export abstract class IMutation {
    abstract createOrganization(organizationInput: OrganizationInput): OrganizationOutput | Promise<OrganizationOutput>;

    abstract updateOrganization(name: string, organizationInput: OrganizationInput): OrganizationOutput | Promise<OrganizationOutput>;

    abstract deleteOrganization(name: string): OrganizationOutput | Promise<OrganizationOutput>;

    abstract createWorker(workerInput: WorkerInput): WorkerOutput | Promise<WorkerOutput>;

    abstract updateWorker(name: string, workerInput: WorkerInput): WorkerOutput | Promise<WorkerOutput>;

    abstract deleteWorker(name: string): WorkerOutput | Promise<WorkerOutput>;
}

export class OrganizationOutput {
    name?: string;
    location?: string;
    phoneNo?: number;
    workers?: WorkerOutput[];
}

export abstract class IQuery {
    abstract organizations(): OrganizationOutput[] | Promise<OrganizationOutput[]>;

    abstract organization(name: string): OrganizationOutput | Promise<OrganizationOutput>;

    abstract workers(): WorkerOutput[] | Promise<WorkerOutput[]>;

    abstract worker(name: string): WorkerOutput | Promise<WorkerOutput>;

    abstract graph(): GraphOutput | Promise<GraphOutput>;
}

export class WorkerOutput {
    name?: string;
    organization?: string;
    age?: number;
    gender?: string;
}
