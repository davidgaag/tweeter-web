# Tweeter-Web

A Twitter web app clone built in React with Typescript, meant to learn and exercise best software development practices and patterns such as:
- Single responsibility principle
- Orthogonality
- Minimizing dependencies
- Open/closed principle
- Depend on abstractions, not concrete implementations
- Error handling
- Writing testable code
- Avoid primitive obsession
- Minimizing code duplication
- Layered software design
- Observer pattern
- Template method
- Generics
- MVP architecture

## Setting Up the Project

1. cd into the tweeter-shared folder
1. Run 'npm install'
1. run 'npm run build'
1. cd into the tweeter-web folder
1. Run 'npm install'
1. Run 'npm run build'

**Note:** If you are using Windows, make sure to use a Git Bash terminal instead of Windows Powershell. Otherwise, the scripts won't run properly in tweeter-shared and it will cause errors when building tweeter-web.

## Rebuilding the Project

Rebuild either module of the project (tweeter-shared or tweeter-web) by running 'npm run build' after making any code or configuration changes in the module. The 'tweeter-web' module is dependent on 'tweeter-shared', so if you change 'tweeter-shared' you will also need to rebuild 'tweeter-web'. After rebuilding 'tweeter-shared' you will likely need to restart VS Code (see note above under 'Setting Up the Project').

## Running the Project

Run the project by running 'npm start' from within the 'tweeter-web' folder.
