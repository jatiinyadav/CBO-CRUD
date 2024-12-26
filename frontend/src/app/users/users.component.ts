import { Component, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DELETE_USER, GET_USERS, MUTATE_USER, SUBSCRIBE_USER } from '../graphql.queries';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  createdDate: Date;
  isActive: boolean;
}

enum ChangeType {
  NONE,
  DELETE,
  INSERT,
  UPDATE
}

interface ResponseData {
  onRoleAdded: {
    operation: string;
    user: UserDetails;
  };
}

interface UserChangePayloadInput {
  operation: ChangeType;
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
  public fullName = "";
  public email = "";
  public isActive = false;
  fetchingUsers = true;
  private subscription!: Subscription;
  public addingNewUser = false;
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
            this.users = [...this.users, onRoleAdded.user];
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
    console.log(user);
    this.apollo
      .mutate({
        mutation: DELETE_USER,
        variables: {
          "user": {
            "operation": `DELETE`,
            "user": {
              "id": user.id,
              "name": `${user.name}`,
              "email": `${user.email}`,
              "createdDate": `${user.createdDate}`,
              "isActive": user.isActive,
            },
          }
        }
      })
      .subscribe(({ data, errors, loading }) => {
        if (errors) {
          console.error('Error creating user', errors);
          alert(`Error creating user: ${errors[0].message}`);
        }
        if (data) {
          console.log('New user created', JSON.stringify(data, null, 2));
        }
      });
  }

  addNewUser() {
    this.addingNewUser = !this.addingNewUser
  }

  receiveNewUser(user: any) {
    console.log(user);
    this.apollo
      .mutate({
        mutation: MUTATE_USER,
        variables: {
          "user": {
            "operation": `INSERT`,
            "user": {
              "id": 100,
              "name": `${user.fullName}`,
              "email": `${user.email}`,
              "createdDate": `2024-12-21T00:00:00Z`,
              "isActive": false,
            },
          }
        }
      })
      .subscribe(({ data, errors, loading }) => {
        if (errors) {
          console.error('Error creating user', errors);
          alert(`Error creating user: ${errors[0].message}`);
        }
        if (data) {
          console.log('New user created', JSON.stringify(data, null, 2));
        }
      });
    this.addingNewUser = !this.addingNewUser
  }

  updateUser(user: UserDetails) {
    this.fullName = user.name
    this.email = user.email
    this.isActive = user.isActive
    console.log(user);
    
    this.addingNewUser = !this.addingNewUser
  }
}
