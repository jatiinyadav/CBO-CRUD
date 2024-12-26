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

export const SUBSCRIBE_USER = gql`
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

export const MUTATE_USER = gql`
  mutation InsertNewUser($user: UserChangePayloadInput!) {
    insertNewUser(user: $user) {
      operation
      user {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($user: UserChangePayloadInput!) {
    deleteUser(user: $user) {
      operation
      user {
        id
        name
        email
      }
    }
  }
`;
