##### 🚧👷🚧 **This project is currently under construction { ...workInProgress }**

# Fullstack TypeScript React Grocery List App

### **List Together**

List Together is a simple, modern list app built with family sharing capabilities.

### **🚀 Features**

- Create and Manage Lists
- Add, Strike, and Delete, Items
- Easily Share Lists
- Auto Complete
- Undo Capabilities
- Smart Sort
- Simple oAuth Sign-up / Login
- Responsive Mobile Design
- Keyboard Accessibility

User's create an account by signing in with Google, Twitter, or Facebook. The database's User entity will only store the user's email. This is to be used in sharing lists with other users. No passwords stored, no account information to remember.

Each user can create up to 25 lists. Lists can be renamed, removed, or shared to other users. Every list contains a history of items added and removed to be used in that list's Auto Complete and Smart Sort features.

Lists can store up to 300 items each. Users with access to a list can add items, strike items, and/or delete items. Each user can also sort the order the items for their own unique display.

Most list actions are stored locally to be used in the `Undo` feature. Users can conveniently undo or redo these actions to revert the list back to their preferred state.

Striking items will immediately sort to the bottom on the list. Un-striking will attempt to sort the item back into the list. While a list has striked items, users can enter `Review` mode to view only their striked items. `Review` mode can be used to immediately delete all striked items.

Items on the lists can be sorted manually, or by using the `SmartSort` feature. As the history of your lists grow, `SmartSort` will remember the order in which your items have previously been removed.

By default, this option will try to sort your list into the route you take through the store. Alternatively you can save your own order for each item by sorting your list manually then using the `SaveOrder` option.

Users can easily share their lists with friends via email address. The shared user must first create an account for the server to accept it as a sharable email address.

In addition, owners of a list can choose to limit the privileges they want that shared user to have. Available Privilege levels include `read`, `add`, `strike`, and `full`. This feature is intended to protect your list from being cleared out accidentally by younger family members or friends but still allowing them access to add items or read the list.

This app also features some limited offline functionality. Users can install the app locally as a PWA. When in offline mode, they can view their last available list queries from the cache. Interacting with the lists does not work offline.

## **👨🏿‍💻 Todo before release**

- Setup better subscription system for notifying users of newly shared lists
- Determine `if (!online)` for PWA offline list query viewing (Possibly with subscription)
- Manually test the offline functionality of the production React build
- Setup Docker for the backend, learn Dokku for deployment
- Clear out remaining bugs 🐛

## **🤔 Possibly todo after release**

- Implement offline mutation capabilities for Apollo Client
- Add test user creation from front-to-back without Passport APIs for a better dev environment
- Implement testing on front-end / research end to end testing
- Convert server callbacks to Redis to prevent them from being cancelled
- Add an `./app` directory with a React Native version of List Together

## **🐞 Known Bugs**

- ...someBugsProbably

## **💽 Backend made with:**

- [TypeORM](https://github.com/typeorm/typeorm)
- [Postgres](https://github.com/postgres/postgres)
- [Express](https://github.com/expressjs/session)
- [Passport](https://github.com/jaredhanson/passport)
- [Apollo Server](https://github.com/apollographql/apollo-server)
- Redis with [ioRedis](https://github.com/luin/ioredis)
- [Type-GraphQL](https://github.com/MichalLytek/type-graphql)

As a work in progress, the server has not yet been hosted anywhere. Before production I do intend to add Docker into the workflow with Dokku in particular.

For now, to install and test the app locally you will first need to setup Postgres and Redis on your system. You will also need to provide a .env file with the appropriate fields filled in. Afterwards, install and run the the server in development mode with:

In the .env file you will need to provide at least one method for logging in via Passport

```
cd ./server && yarn install && yarn dev
```

When making changes to the code in development mode you'll need to open another terminal to the `/server` directory and run:

```
yarn watch
```

Before committing any changes to the backend be sure to test the resolvers by running:

```
yarn test
```

This backend was bootstrapped with:

```
typeorm init --name list-together --database postgres
```

## **💻 Frontend made with:**

- [React](https://github.com/facebook/react)
- [Apollo Client](https://github.com/apollographql/apollo-client)
- [GraphQL Codegen](https://github.com/dotansimha/graphql-code-generator)
- [Workbox](https://github.com/googlechrome/workbox)
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)

Also a huge thanks for all of the work put into the [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react)

The project will eventually be hosted via Netlify under an undecided domain name. Current plan is to host the api on a subdomain of that undecided domain name. It could also be renamed at some point before then.

To install and run the front end locally you will need to run:

```
cd ./web && yarn install && yarn start
```

Frontend was bootstrapped with:

```
npx create-react-app my-app --template cra-template-pwa-typescript
```

## **📖 About the project:**

List Together is a project I've created to upgrade our personal grocery list routine. I used this opportunity to expand my knowledge of React with TypeScript.

TypeScript was the hardest part of my recent web-dev learning journey. Whenever I encounter something frustrating and difficult, I've always attempted to meet that problem head on. Therefore, I decided to create a full stack application using as much TypeScript as I possibly could.

Now I can absolutely say that TypeScript is no longer difficult for me. As expected, I now prefer it over plain JavaScript as it provides much more information. After about a week of using TypeScript regularly it became an extremely useful tool. There was a certain moment where I stopped struggling against the compiler and started working **with** the compiler.

After attempting several different offline-first with Apollo Client methods, I struggled to get offline mutations to work consistently enough to include this feature. Rather than starting over with a stack that includes more robust offline functionality, I decided to finish this app with Apollo and skip offline mutations for now.
