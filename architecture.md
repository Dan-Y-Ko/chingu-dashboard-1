![Architecture Diagram](architecture-diagram.png)

The application is organized around the Next.js App Router and feature-oriented UI components. Pages compose feature-specific and shared components, while custom hooks provide access to client-side state managed through Redux Toolkit.

Backend interactions are handled through server-side actions and services, which provide a consistent interface for communicating with the Chingu API. These services also handle server-side operations such as cache revalidation where required.

Shared utilities and types are reused across features to provide common functionality and maintain consistency throughout the application.
