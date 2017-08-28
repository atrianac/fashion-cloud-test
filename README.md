# cache-api - Fashion Coud

## Cloning the application

 ```bash
 git clone https://github.com/atrianac/fashion-cloud-test.git
 ```


## Running the application

 Use the npm tasks to run the application (execute this command inside application directory):
 
 ```bash
npm run grunt
npm start
 ```
 
 ## Testing the Endpoints
 
 1. Install Postman as is described in [Postman Installation and updates](https://www.getpostman.com/docs/postman/launching_postman/installation_and_updates)
 2. Import the `cache-api.postman_collection` collection as is described in [Postman Sharing collections](https://www.getpostman.com/docs/postman/collections/sharing_collections)
 3. Execute the endpoints according to below description:
 
Endpoint   1. Get all entries
`GET /fashion-cache/entries`

Endpoint   2. Delete all entries
`DELETE /fashion-cache/entries`

Endpoint   3. Create an entry
`POST /fashion-cache/entries?{entry}={value}`

Endpoint   4. Delete an entry
`DELETE /fashion-cache/entries/{entry}`

Endpoint   5. Get an specific entry
`GET fashion-cache/entries/{entry}`

 ## Architecture Summary

The application exposes a classic three layers style:
1.	The web layer (controllers - routers).
2.	The service layer.
3.	The repository layer (mongoose).

