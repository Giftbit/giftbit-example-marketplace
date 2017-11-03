# Interactive Marketplace Example

## Getting Started
 - [sign up](https://testbedapp.giftbit.com/register/registerGiver) for a Giftbit testbed account
 - Install Node.js https://nodejs.org/en/
 - Clone or download the repo
 - Open 2 separate terminals and navigate to the project root in both
 - Configure the server first
    - Open server/config.js
    - Put in your testbed API token ([found here](https://testbedapp.giftbit.com/userAccountManagement/apiKeyManagement))
    - Put in a template ID ([create one here](https://testbedapp.giftbit.com/giftTemplate/list))
 - Start the server before the client
    - IMPORTANT! the server must be started first so the client can proxy to the correct address
    - From one of the terminals
        - cd server
        - npm install
        - npm run start
    - Logs for Giftbit requests and responses will be printed here
 - Start the client
    - Once the server is running
    - From the other terminal
        - cd client
        - npm install
        - npm run start
    - Logs for server requests and responses will be found in your browser console
    
## Logs
Both the Server and Client log requests and responses. In some cases, the server will add extra information before calling Giftbit, so it is recommended to watch the server logs to understand the exact Giftbit requests and responses
 
## Server
config.js
 - Contains your Giftbit testbed API key and email template ID. 
 - This form of storing your API key is not recommended for production. Checkout [this article](http://blog.giftbit.com/how-to-securely-manage-system-configuration-using-aws) for a better approach
 
/services
 - giftbitApiService.js
    - Contains the logic for querying Giftbits API
 - giftbitHttpService.js
    - Contains the logic for requesting and logging Giftbits API
    - The logging from this service will help you understand the shape of Giftbit requests and responses

## Client
src/components/App.js
 - Contains all of the important logic for the client
 - A lot of the code here is more about React than Giftbit
    - Important functions for Giftbit are
        - getBrands()
        - getMarketplaceGifts()
        - getRegions()
        - sendCampaign()
    - These are the functions that send information to the local server
        - viewing these functions will help you understand what react state is used to query Giftbit
        - for all GET requests, the server will simply pass the query parameters to Giftbit, and return the response.
        - for the POST request to /campaign, the server will add some extra information to the body. Therefore it is important view the server logs for seeing what exactly is being sent to Giftbit
        
## Bugs, Improvements, and Suggestions
If you find something that can make the app better, or easier to understand, let us know!
 - You can create an [issue](https://github.com/Giftbit/giftbit-example-marketplace/issues) to start a discussion
 - Next, you can fork the repo, make your changes, then post a pull request
 
The goal of this project is to ease understanding of the Giftbit API. Anything contributing to that goal is appreciated.