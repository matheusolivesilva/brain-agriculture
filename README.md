# Brain Agriculture
This API is responsible to manage agriculture, manage and mantain producers, properties, harvests and crops. Also have some statistics with insights regarding crops, properties and locations.

## 📝 Requirements

- [Docker](https://www.docker.com/get-started/)
- [NodeJs](https://nodejs.org/en/download/current)


## 💡 Features
Made using principles of Clean Architecture and Domain Drivem Design, the general structure (with project structure) is represented in the diagram below:
![diagram](https://github.com/user-attachments/assets/dd2c7779-969a-4bc6-80ef-d4b3579783c7).

## 🔍 Logs and Tracing:
For logs was used the OpenTelemetry, which can be integrated with other observability/logging tools such as Grafana, Datadog, etc... Example of logs using OpenTelemetry:
![image](https://github.com/user-attachments/assets/c8dc918c-c071-48bf-a11a-bad32a0e536f)


## 🚀 How to Run?
For this project would be better for you to have Docker and Docker Compose on your machine.

### 🐋 Using Docker:
Simply run:
```console
foo@bar:~$ docker-compose up
```
The docker console will be attached to your terminal, starting Node and PostgreSQL.

## ✅ Testing
To test you should first access the node terminal using:
```console
foo@bar:~$ docker-compose exec app bash
```

Inside the container, you should run `npm test` in order to execute the unit/integration tests or `npm run test:cov` to run the tests with coverage tests.
Each file is followed by a `.spen` file with the unit test, except the integration tests, those are located in the `tests` directory.

## 📝 Docs
You'll have two ways to learn more about this project: Using Postman or Swagger.
### Postman Collection
You may access the collection, download it, import and use here: [Postman collection](https://github.com/matheusolivesilva/brain-agriculture/blob/main/docs/Brain%20Agriculture.postman_collection.json)


### Swagger
To open docs you should run the project and access http://localhost:3000/api , you'll see the documentation made with Swagger as the print below shows:
![image](https://github.com/user-attachments/assets/d6733b6a-fc1e-4bd9-a67b-f0d8dc92a45c)

## ⚙️ Made With:

- TypeScript 5.1.3
- NodeJS 22.8.0
- Postgres 14
- NestJS 10.4.19
- Jest 29.7.0
- Docker 24.0.7
- Docker Compose 1.29.2

## 🧑🏻‍💻 Author

_Matheus Oliveira da Silva_ - [Github](https://github.com/matheusolivesilva) | [Linkedin](https://www.linkedin.com/in/matheusoliveirasilva/)



