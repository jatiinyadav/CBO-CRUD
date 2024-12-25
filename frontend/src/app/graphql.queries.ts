import { gql } from 'apollo-angular';

export const GET_USERS = gql`
query Users {
  users {
    id
    name
    email
    createdDate
    isActive
  }
}
`;

export const ON_USER_ADDED = gql`
  subscription OnRoleAdded {
    onRoleAdded {
      operation
        user {
        id
        name
        email
        createdDate
        isActive
      }
    }
  }
`;