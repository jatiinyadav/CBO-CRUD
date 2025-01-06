# Frontend (Angular)
1. Clone the repository:
```bash git clone https://github.com/jatiinyadav/cbo-crud.git
cd cbo-crud/frontend
```

2. Install dependencies:
```bash
npm install
```
3. Run the Angular development server:
```bash
npm start
```

# Backend (.NET with GraphQL)
1. Open Backend in Visual Studio 2022:
```bash
cd cbo-crud/ProjectOne
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Required NuGet Packages: Ensure the following packages are listed in your `.csproj` file:
```bash
<PackageReference Include="HotChocolate.AspNetCore" Version="14.3.0" />
<PackageReference Include="HotChocolate.Subscriptions" Version="14.3.0" />
<PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.2" />
<PackageReference Include="SqlTableDependency" Version="8.5.8" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="7.2.0" />
<PackageReference Include="TableDependency.SqlClient" Version="1.0.0" />
```

4. Update the connection string: Add your SQL Server connection string in `appsettings.json`:
```bash
"ConnectionStrings": {
    "MySqlConnection": "data source=SP\\SQLEXPRESS;initial catalog=Testing;integrated security=True;User Id=sa;password=Admin123;TrustServerCertificate=True"
}
```

5. Run the backend:
```bash
dotnet run
```

# Database (SQL Server)
Create the database:

Open SQL Server Management Studio (SSMS).
Execute the following script to create the Testing database and UserDetails table:
```bash
CREATE DATABASE Testing;
GO

USE Testing;
GO

CREATE TABLE UserDetails (
    Id INT PRIMARY KEY IDENTITY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    IsActive BIT NOT NULL
);
GO
```

1. Insert sample data:
```bash
INSERT INTO UserDetails (Name, Email, IsActive)
VALUES ('John Doe', 'john.doe@example.com', 1),
       ('Jane Smith', 'jane.smith@example.com', 0);

```

# Usage
Start the frontend and backend servers:

1. Run the Angular development server (ng serve) for the frontend.
2. Run the .NET backend server (dotnet run) for the API.
3. Access the application:
   
    i) Frontend: Navigate to http://localhost:4200 in your browser.
   
    ii) Backend: Access the GraphQL Playground at http://localhost:5000/graphql.
   
    iii) Query the GraphQL API: Example GraphQL query:
