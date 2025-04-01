Node.js application has an API that retrieves messages that were saved in the MongoDB database. It also allows the database to be updated when a message is sent to ensure that messages are not sent multiple times.

Use the following commands to deploy with Docker:

```
sudo docker pull meshrelay0/meshrelay-meshapi-messages
sudo docker run -d -p 3030:3030 --name meshapi-messages \
--network network_name \
-e MONGODB_URI=mongodb_uri \
--restart always \
meshrelay0/meshrelay-meshapi-messages
