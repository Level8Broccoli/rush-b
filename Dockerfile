FROM openjdk:17.0.1 as backend_build

ENV DIRPATH=/app/
WORKDIR ${DIRPATH}

COPY ./backend/mvnw .
COPY ./backend/pom.xml .
COPY ./backend/.mvn .mvn
COPY ./backend/src src/

RUN chmod +x mvnw
RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)


FROM node:18-alpine as frontend_build

ENV DIRPATH=/app/
WORKDIR ${DIRPATH}

COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install
COPY ./frontend/ .
RUN npm run build


FROM openjdk:17.0.1

ENV DIRPATH=/app/

ARG DEPENDENCY=${DIRPATH}target/dependency
COPY --from=backend_build ${DEPENDENCY}/BOOT-INF/lib/ ${DIRPATH}lib/
COPY --from=backend_build ${DEPENDENCY}/META-INF/ ${DIRPATH}META-INF/
COPY --from=backend_build ${DEPENDENCY}/BOOT-INF/classes/ ${DIRPATH}
COPY --from=frontend_build ${DIRPATH}dist/ /public/

EXPOSE 8080

ENTRYPOINT ["java","-cp","app:app/lib/*","ch.ffhs.rushb.RushbApplicationKt"]