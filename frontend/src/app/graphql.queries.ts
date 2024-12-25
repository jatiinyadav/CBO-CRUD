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
  mutation ChangeUser {
    insertNewUser(user: {
      operation: INSERT,
      user: {
        id: 100,
        name: "John Doe",
        email: "johndoe@example.com",
        createdDate: "2024-12-21T00:00:00Z", 
        isActive: true 
      }
    }) {
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
  mutation DeleteUser {
    deleteUser(user: {
      operation: DELETE,
      user: {
        id: 37,
        name: "Jane Smith",
        email: "john.snow@example.com",
        createdDate: "2024-12-25T11:57:14.537Z", 
        isActive: false 
      }
    }) {
      operation
      user {
        id
        name
        email
      }
    }
  }
`;
