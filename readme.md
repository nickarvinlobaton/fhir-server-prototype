# Fhir Server Prototype

Fhir server sample prototype

## Auth Server setup

1. cd to auth-server

```bash
cd auth-server
```

2. Setup laravel

```bash
composer install
```

3. Import .sql file into db
4. Install passport

```bash
php artisan passport:install
```

5. Issue access tokens using Postman Autorization tab->Select Oauth 2.0 type->Click Get new Access token
   ![img](https://i.ibb.co/6XmD0pM/instruction.png)
6. Fill out request token form
   ![img](https://i.ibb.co/j6j0Dqy/issue-tokens.png)
7. Login form use - email: jd@gmail.com password: 12345678
8. Use issued tokens as Authorization bearer header when accessing fhir-server endpoints.

## FHIR Server setup

Please make sure to setup couchbase server by adding a bucket

1. cd to fhir-server

```bash
cd fhir-server
```

2. NPM install

```bash
npm install
```

3. Edit .env file variables
4. Fhir server rest api endpoints\
   -Create patient - POST http://localhost:3000/4_0_0/Patient \
   -Get patient by ID - GET http://localhost:3000/4_0_0/Patient/:id \
   -Delete patient - DELETE http://localhost:3000/4_0_0/Patient/:id \
   -Update patient - PUT http://localhost:3000/4_0_0/Patient/:id \
   --Sample Patient resource for create patient endpoint--

```json
{
  "resourceType": "Patient",
  "id": "1214692",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2020-06-17T05:41:02.812+00:00",
    "source": "#iPvBh1iw20uXOuae"
  },
  "text": {
    "status": "generated"
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MR",
            "display": "Medical Record Number"
          }
        ],
        "text": "Medical Record Number"
      },
      "value": "CT8247"
    },
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "NIIP",
            "display": "National Insurance Payor Identifier"
          }
        ],
        "text": "National Insurance Payor Identifier"
      },
      "value": "9800003564"
    }
  ],
  "name": [
    {
      "family": "David",
      "given": ["Clark"]
    }
  ],
  "gender": "male"
}
```

## Scopes

1. To enable allow all scopes edit auth-server/app/Providers/AuthServiceProvider.php boot() function

```php
Passport::setDefaultScope([
            'user/*.*',
        ]);
```

2. FHIR Scopes documentation <http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html>
