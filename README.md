# Route
Simple routing application.

## Source
* https://github.com/stepanradaman/route_postgresql

## Usage
* terminal: 
  - docker pull node / postgres / kartoza/postgis / kartoza/geoserver
  - cd [app folder]
  - docker build -t route .
  - docker-compose up -d
* wait Geoserver initialization (3 min)
* browser:
  - http://localhost:3000/

## Links
* https://hub.docker.com/_/node
* https://hub.docker.com/_/postgres
* https://hub.docker.com/r/kartoza/geoserver
* https://hub.docker.com/r/kartoza/postgis


