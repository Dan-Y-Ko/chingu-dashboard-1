# Chingu Dashboard

The Chingu Dashboard is an internal web platform designed to streamline
the onboarding and project experience for members of the Chingu community.

## Project Overview

Chingu is a community where developers are matched into teams to collaborate
on software projects over a defined development period.

The first phase of the Dashboard focused on improving the onboarding experience
for new members and providing a centralized platform for managing their
participation in Chingu projects.

For more information about Chingu, visit [chingu.io](https://www.chingu.io/).

## Project History

Development was carried out by a rotating volunteer development team over
multiple development cycles. The frontend team typically consisted of 5–6
developers within a larger 20-person cross-functional organization.

The project progressed through planning, feature implementation, code review,
integration, and internal alpha testing.

## Status

The project reached an internal alpha and was deployed to Vercel for internal
testing. It was not released publicly.

**Current Status:** Terminated

## My Role

I served as the **Lead Frontend Developer**, leading a 5–6 person frontend
team within a 20-person cross-functional organization.

My responsibilities included:

- Designing the frontend architecture from scratch
- Establishing frontend development standards and workflows
- Implementing application features
- Reviewing pull requests
- Mentoring developers
- Coordinating frontend/backend integration
- Establishing CI/CD and release workflows

## Tech Stack

- Next.js
- TypeScript
- Redux Toolkit
- Tailwind CSS
- GitHub Actions
- ESLint
- Prettier
- Husky
- semantic-release
- Cypress
- Jest
- Storybook
- Vercel

## Engineering Practices

- Pull-request based development
- Automated linting
- Automated deployment
- Semantic versioning
- Conventional commit enforcement
- Pre-commit hooks
- Component development with Storybook

## Development Workflow

Development followed a pull-request-based workflow:

1. Work was planned and broken into sprint-sized tasks.
2. Developers implemented changes on feature branches.
3. Changes were submitted through pull requests.
4. Frontend changes were reviewed before merging.
5. Automated checks and release workflows were run through GitHub Actions.
6. Releases were versioned using semantic-release and deployed to Vercel.

## Shared Component Library

A separate component library was created and maintained to provide reusable
UI components across the application.

**Repository:** [chingu-dashboard-components](https://github.com/Dan-Y-Ko/chingu-dashboard-components)

## Architecture

![Architecture Diagram](architecture-diagram.png)
See here for more details: https://github.com/Dan-Y-Ko/chingu-dashboard-1/blob/dev/architecture.md

## Major Technical Challenges

### Server Components and Authentication

One of the major challenges encountered during development involved the
interaction between Next.js App Router server components and our authentication
flow. Refresh-token functionality did not behave reliably within certain routes.

We investigated the issue and determined that the server-component architecture
was introducing complexity that was not providing sufficient benefit for the
application's requirements.

As a result, we began migrating the application toward a client-component-based
architecture to simplify authentication and application state management.
The migration was in progress when the project was terminated.

### Server-Side Interaction During Voting

We also encountered an issue with the application's voting functionality.
Rapid successive interactions with the voting control could result in server-side
errors because the interaction was not being registered reliably by the
Next.js application.

This contributed to the decision to reduce reliance on server components and
move the affected functionality toward client-side handling.
