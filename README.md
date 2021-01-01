# **Typescript React Grocery List PWA**

Hello, I'm fedellen and this is my first typescript project -🔥🔥-🔥🔥->👍

Typescript was the hardest part of my recent learning journey. Whenever I encounter something frustrating and difficult, I always attempt do it first. Therefore, I decided to create a simple full stack application using as much Typescript as I could.

I can now safely say that Typescript is no longer difficult for me. As expected, I now prefer it over plain Javascript as it provides much more information. After about a week of using Typescript regularly it became an extremely useful tool. There was a certain moment where I stopped struggling against the compiler and started working **with** the compiler.

## **Its on the List**

This is a simplistic list app built with family sharing capabilities. I chose to create the backend on my own rather than using a service like Firebase mainly for experience and portfolio building.

This app features limited offline functionality. Including installing locally as a PWA and viewing your list queries offline. Interacting with your lists currently does not work offline.

After attempting several different offline-first with Apollo Client methods I struggled to get offline mutations to work consistently enough to include this feature. Rather than starting over with a stack that includes more robust offline functionality, I decidied to finish this app with Apollo + GraphQL.

## **Backend**

- TypeORM
- Postgres
- Type-GraphQL
- Apollo Server
- Express

Backend bootstrapped with:

```
typeorm init --name MyProject --database postgres
```

## **Frontend**

- React
- Apollo Client
- GraphQL Codegen
- Workbox (PWA Features)
- Tailwind

Frontend bootstrapped with

```
npx create-react-app my-app --template cra-template-pwa-typescript
```
