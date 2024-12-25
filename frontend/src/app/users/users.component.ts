import { Component, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DELETE_USER, GET_USERS, SUBSCRIBE_USER } from '../graphql.queries';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataTable } from 'simple-datatables';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  createdDate: Date;
  isActive: boolean;
}

interface ResponseData {
  onRoleAdded: {
    operation: string;
    user: UserDetails;
  };
}

interface DeleteUser {
  operation: string;
  user: UserDetails;
}

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: UserDetails[] = [{
    id: 0,
    name: 'Jatin Yadav',
    email: 'jatin@gmail.com',
    createdDate: new Date(),
    isActive: false
  }];

  users$: BehaviorSubject<UserDetails[]> = new BehaviorSubject<UserDetails[]>([]);
  columns = ["Name", "Email", "Created Date", "IsActive"]
  fetchingUsers = true;
  private subscription!: Subscription;
  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.fetchUsers();
    this.subscribeToUserAdded();
  }

  fetchUsers() {
    this.apollo.query<any>({ query: GET_USERS }).subscribe(({ data }) => {
      this.users = data.users;
      this.fetchingUsers = false;
      console.log('Fetched Users:', this.users);
    });
  }

  subscribeToUserAdded() {
    if (!this.subscription) {
      this.subscription = this.apollo
        .subscribe<ResponseData>({ query: SUBSCRIBE_USER })
        .subscribe(({ data }) => {

          if (data && data.onRoleAdded.operation == 'INSERT') {
            const { onRoleAdded } = data;
            this.users = [onRoleAdded.user, ...this.users];
            console.log('New User Added:', this.users);
          }

          else if (data && data.onRoleAdded.operation == 'DELETE') {
            this.users = this.users.filter((user: UserDetails) => user.id != data.onRoleAdded.user.id)
          }

          else if (data && data.onRoleAdded.operation == 'UPDATE') {
            this.users.forEach((user: UserDetails) => {
              if (user.id == data.onRoleAdded.user.id) {
                user = data.onRoleAdded.user
              }
            })

          }
        });
    }
  }

  deleteUser(user: UserDetails) {

    const deleteUser: DeleteUser = {
      operation: 'DELETE',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdDate: user.createdDate,
        isActive: user.isActive,
      },

    }

    this.apollo
      .mutate({
        mutation: DELETE_USER,
      })
      .subscribe(
        (response) => {
          console.log('User deleted:', response);
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );

  }
}
