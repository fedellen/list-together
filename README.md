# Fullstack TypeScript React Grocery List App

### **List Together**

List Together is a simple, modern list app built with sharing capabilities. Completely free to use and open source.

https://www.listtogether.app

## **🚀 Features**

- Create and Manage Lists
- Add, Strike, and Delete Items
- Add Notes to Items
- Share Lists
- Auto Complete
- Undo Capabilities
- Smart Sort
- Simple oAuth Sign-up / Login
- Responsive Mobile Design
- Keyboard Accessibility

Users can easily create an account by signing in with Google, Twitter, or Facebook. The database's User entity will only store the user's email. This is to be used in sharing lists with other users. No passwords stored, no account information to remember.

Each user can create up to 15 lists. Lists can be renamed, removed, or shared to other users. Every list contains a history of items added and removed to be used in that list's Auto Complete and Smart Sort features.

Lists can store up to 150 items each. Users with access to a list can add items, strike items, and/or delete items. Every item can also display up to 10 unique notes.

Most list actions are stored locally to be used in the `Undo` feature. Users can conveniently undo or redo these actions to revert the list back to their preferred state.

Striking items will immediately sort that item to the bottom on the list. Un-striking will sort the item back into the list. While a list has striked items, users can enter `Review` mode to view only their striked items. While in `Review` mode, users can quickly delete all currently striked items on the list.

Users can easily share their lists with friends or family via email address. The shared user must have an account already created for server to accept it as a sharable email address. While online, the shared user will receive a notification and the list immediately upon sharing.

Owners of a list can choose to limit the privileges they want that shared user to have. Available Privilege levels include `read`, `add`, `strike`, and `full`. This feature is intended to protect your list from being cleared out accidentally by younger family members or friends but still allowing them access to add items or read the list.

Each user can sort the order the items for their own unique display, without disrupting the order of shared users' sorted items. Items on the list can be sorted manually, or by using the `SmartSort` feature. As the history of your lists grow, `SmartSort` will remember the order in which your items have previously been removed.

By default, the `SmartSort` option will try to sort your list into the route you take through the store. Alternatively you can save your own order for each item by sorting your list manually then using the `SaveOrder` option located in the `HeaderOptions`.

This app also features some limited offline functionality. Users can install the app locally as a PWA. When in offline mode, they can view their last available list queries from the cache. Interacting with the lists does not work offline.

## **🤔 Possibly todo after release**

- Edit item feature (Mutation that renames both `item.name` and `itemHistory.item`)
- Share list via link or email. Shared user would still need to create account upon clicking share link.
- Optimistic responses on item mutations for quicker user interaction, especially for users located further from the server (Toronto)
- More back-end resolver tests, there remains some uncovered logic
- Add test user creation from front-to-back without Passport APIs for a better dev environment (for collaborators)
- Implement testing on front-end / end to end testing
- Convert server callbacks to Redis (or cron jobs) to prevent them from being cancelled (Only related to Smart Features)
- Add an `./app` directory with a React Native version of List Together
- Implement offline mutation capabilities for Apollo Client

## **💽 Backend made with:**

- [TypeORM](https://github.com/typeorm/typeorm)
- [Postgres](https://github.com/postgres/postgres)
- [Express](https://github.com/expressjs/session)
- [Passport](https://github.com/jaredhanson/passport)
- [Apollo Server](https://github.com/apollographql/apollo-server)
- [ioRedis](https://github.com/luin/ioredis)
- [Type-GraphQL](https://github.com/MichalLytek/type-graphql)

The backend is currently deployed on Digital Ocean droplet with [Dokku](https://github.com/dokku/dokku).

To install and test List Together locally you will first need to setup Postgres and Redis on your system. You will also need to provide a .env file with the appropriate fields filled in, see [.env.example](https://github.com/fedellen/list-together/blob/master/server/.env.example). The current dev environment requires at least one method of logging in via a Passport API (Google / Twitter / Facebook), in which you'll need to create a dummy app for testing. Afterwards, install and run the server in development mode with:

```
cd ./server && yarn && yarn dev
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
- [Tailwind](https://github.com/tailwindlabs/tailwindcss)
- [Workbox](https://github.com/googlechrome/workbox)

Also a huge thanks for all of the work put into the [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react)

The front-end is hosted on Netlify and available at: https://www.listtogether.app

Updates to the `/web` directory on the master branch will trigger Netlify deployment.

To install and run the front end locally you will need to run:

```
cd ./web && yarn && yarn start
```

Frontend was bootstrapped with:

```
npx create-react-app my-app --template cra-template-pwa-typescript
```

## **📖 About the project**

List Together is a project I've created to upgrade our personal grocery list routine. I used this opportunity to expand my knowledge of React with TypeScript.

TypeScript was the hardest part of my recent web-dev learning journey. Whenever I encounter something frustrating and difficult, I've always attempted to meet that problem head on. Therefore, I decided to create a full stack application using as much TypeScript as I possibly could.

Now I can absolutely write that TypeScript is no longer difficult or frustrating for me. As expected, I now prefer it over plain JavaScript as it provides much more information and an awesome developer experience. After about a week of using TypeScript regularly it became an very useful tool. There was a certain moment where I stopped struggling against the TypeChecker and started working **with** the TypeChecker.

After attempting several different offline-first with Apollo Client methods, I struggled to get offline mutations to work consistently enough to include this feature. Rather than starting over with a stack that includes more robust offline functionality, I decided to finish this app with Apollo and skip the offline mutations for now.

## **💖 Support us**

List Together is free to use and it&rsquo;s code is open source on
GitHub. Contributions to the project and
forks are more than welcome. You can support the project or help us pay server costs by tipping us a [Ko-fi](https://ko-fi.com/pixelpajamastudios)

```
MIT License

Copyright (c) 2021 Derek R Sonnenberg, Pixel Pajama Studios LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
