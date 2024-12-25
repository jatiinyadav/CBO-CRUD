import { Component, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_USERS, ON_USER_ADDED } from '../graphql.queries';
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
    this.apollo.watchQuery<any>({ query: GET_USERS }).valueChanges.subscribe(({ data }) => {
      this.users = data.users;
      this.fetchingUsers = false;
      setTimeout(() => {
        this.createTable();
      }, 0);
      console.log('Fetched Users:', this.users);
    });
  }

  private dataTableInstance: DataTable | null = null;
  createTable() {
    const tableElement = document.getElementById('default-table');

    if (tableElement) {

      if (this.dataTableInstance) {
        this.dataTableInstance.destroy();
        this.dataTableInstance = null;  // Clear the reference after destroying
      }

      setTimeout(() => {
        this.dataTableInstance = new DataTable(tableElement as HTMLTableElement, {
          searchable: true,
          sortable: true,
          perPage: 5,
          perPageSelect: [3, 5, 10],
        });
      }, 100)

    }
  }

  subscribeToUserAdded() {
    if (!this.subscription) {
      this.subscription = this.apollo
        .subscribe<ResponseData>({ query: ON_USER_ADDED })
        .subscribe(({ data }) => {

          if (data && data.onRoleAdded.operation == 'INSERT') {
            const { onRoleAdded } = data;
            this.users = [...this.users, onRoleAdded.user];
            console.log('New User Added:', this.users);
            setTimeout(() => {
              this.createTable();
            }, 0);
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
}
