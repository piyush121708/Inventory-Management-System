# Backend review and fixes

## Confirmed issues fixed

- Bill date filtering used an inclusive upper bound, so a bill timestamped exactly at midnight on the next day could appear in the previous day's results. Bill lists and dashboard counts now use a start-inclusive, next-day-exclusive range.
- Category and supplier controllers accessed repositories directly. They now delegate through service classes, matching the Controller -> Service -> Repository structure. Missing records on update/get/delete now return the existing 404 error response rather than an unhandled server error.
- Stock history accepted negative page numbers and non-positive or excessive page sizes, which could become a server error or an unnecessarily large query. The service now returns HTTP 400 for invalid values and caps page size at 100.
- Concurrent sales could read the same stock balance before either write completed. Stock changes now lock the product row before calculating and saving the new balance.
- The datasource password was committed as a fixed value. URL, username, and password are configurable through `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`, with local development defaults documented in the README.
- The managed Lombok version was implicit and could lag the JDK used by the IDE/compiler, causing javac initialization errors such as `TypeTag :: UNKNOWN`. Lombok is now explicitly pinned to 1.18.48 and configured as an annotation processor for Maven builds.

## Security and dependency review

- No Spring Security dependency, authentication filter, or login/JWT code exists in the supplied project, so none needed removal.
- Existing employee role checks remain for manager-only operations. These are the project's business rules and do not add login or authentication.
- The existing Maven dependencies cover the implemented Spring Web, JPA, validation, MySQL, Lombok, and test functionality. No extra dependency was added.

## Tests and environment limits

Added unit tests for stock movement updates, prevention of negative stock, invalid stock history pagination, and bill date range boundaries. Run them with `mvn test`.

The source archive does not include a Maven wrapper, and Maven is not installed in the inspection environment. A Maven compile/test run and a live MySQL connectivity check could not be performed here. Configure MySQL credentials with the documented environment variables before running the application locally.
