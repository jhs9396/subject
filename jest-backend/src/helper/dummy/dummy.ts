import { OrganizationInput, WorkerInput } from '../../graphql.schema.generated';

type DataType = {
  organizations: OrganizationInput[];
  workers: WorkerInput[];
};

export const payload: DataType = {
  organizations: [
    {
      name: 'pee',
      location: 'Seoul',
      phoneNo: 111122222,
    },
    {
      name: 'bank',
      location: 'Seoul',
      phoneNo: 2233123,
    },
    {
      name: 'bit',
      location: 'Seoul',
      phoneNo: 333333,
    },
    {
      name: 'bespi',
      location: 'Seoul',
      phoneNo: 444444,
    },
  ],
  workers: [
    {
      name: 'jhs',
      organization: 'pee',
      age: 10,
      gender: 'Male',
    },
    {
      name: 'jgw',
      organization: 'bank',
      age: 22,
      gender: 'Male',
    },
    {
      name: 'ljh',
      organization: 'bespi',
      age: 21,
      gender: 'Male',
    },
    {
      name: 'hjh',
      organization: 'bit',
      age: 25,
      gender: 'Male',
    },
    {
      name: 'lhs',
      organization: 'bit',
      age: 5,
      gender: 'Male',
    },
  ],
};
