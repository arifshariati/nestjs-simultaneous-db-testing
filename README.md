# nestjs-simultaneous-db-testing
This repo emphasizes on ways to integrate multiple db located at various places. Main focus of the code block is to synch two db while reading thousands of records simultaneously.

## Key Challenge
White serving both nodeJs server on localhost, accessing one nodeJs server from withing another nodeJs server with Axios (http://localhost:5000) does not work. The problem here is that nodeJs works on single thread and both nodeJs server will be handled with same single thread causing ECONNECREFUSED.

To solve this problem, inter-docker communication mechanism comes in handy where accessing nodeJs server container with its name (which at the backend reaches to dynamic IP of container) makes it possible. The correct method for accessing nodeJs server via inter-docker communication is as bellow;

```
CLOUD_URI=http://cloud:5000

```

Where in above, cloud is name of the container with its external port 5000. 

In addition to above, make sure all containers are on the same network. Below is docker-compose.yml configuration.

```
version: '2'

services:
  # Local- backend
  # ****************************************
  local:
    container_name: Local
    build:
      context: ./local
    volumes:
      - ./local:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - 4000:4000
    env_file: 
      - ./local/local.env
    command: npm run start:dev
    networks:
      - nestjs-simultaneous-db-test
    depends_on:
      - mongodb
      - cloud
# Cloud- backend
  # ****************************************
  cloud:
    container_name: Cloud
    build:
      context: ./cloud
    volumes:
      - ./cloud:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - 5000:5000
    env_file:
      - ./cloud/cloud.env
    command: npm run start:dev
    networks:
      - nestjs-simultaneous-db-test
    depends_on:
      - mongodb
  #mongodb
  # ****************************************
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - 27017:27017
    volumes:
      - ../mongo-data/:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    restart:  always
    networks:
      - nestjs-simultaneous-db-test
networks:
  nestjs-simultaneous-db-test: 

```

## Robust API Access and mongoDB execution
The aim of this code block is to synch local mongoDB with external data source where number of records are > 100 K. Number of records that Axios can make healthy request and response per minute can differ, however, 100 records per minute seems reasonable powered by cronJob. You can test out various data limits by playing with below code section in project.

```
@Cron(CronExpression.EVERY_MINUTE)
  syncLocalDB() {
    logger.debug('Called every Minute');
    this.synchDB();
  }

  private async synchDB(){
    const users = await this.userModel.find({"synched":false}).limit(100);
    

    if(users.length > 0){
      users.map(user => {
        let postData = {
          "email": user.email,
          "gender": user.gender
        };
        try{
            
          Axios.post(`${process.env.CLOUD_URI}/user/single`, postData)
          .then(response => {
            if(Object.keys(response.data)){
              let newInstance = new this.userModel(user);
              newInstance.synched = true;
              logger.log(`updating ${newInstance._id}`);
              this.userModel.findOneAndUpdate({_id:newInstance._id},newInstance);
            }
          })
          .catch(error => {
            console.log('Axios Error = ', error.message);
          })
        }
        catch(err){
          console.log('Try Error = ', err.response.data);
        }
      });
    }else{
      logger.log('NO user with false found');
    }
  }

```

If you have any comment or suggestion, Please do let me know.

Happy Coding ! 
