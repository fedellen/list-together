# **Typescript React Grocery List App**

## **List Together**

List Together is a simple, modern list app built with family sharing capabilities in mind.

## Features

- Sharable
- Auto Complete
- Smart Sort
-
-

Each user can create up to 30 lists. Lists can be renamed, removed, or shared to other users. Every list contains a history of items added and removed to be used in that list's `AutoComplete` and `SmartSort` features.

Lists can have up to 300 items each. Users with access list can add items, strike items, and delete items. Each user can also sort the order the items for their own unique display.

Striking items will immediately sort to the bottom on the list. Un-striking will attempt to sort the item back into the list. While a list has striked items, users can enter `Review` mode to view only their striked items. `Review` mode can be used to immediately delete all striked items.

Items on the lists can be sorted manually, or by using the `SmartSort` feature. As the history of your lists grow, `SmartSort` will remember the order in which your items have previously been removed.

By default, this option will try to sort your list into the route you take through the store. Alternatively you can save your own order for each item by sorting your list manually then using the `SaveOrder` option.

Users can easily share their lists with friends via email address. In addition, owners of the list can choose to limit the privileges they want that shared user to have. Available Privilege levels include `read`, `add`, `strike`, and `full`

This app also features limited offline functionality. Including installing locally as a PWA and viewing your cached list queries while offline. Interacting with your lists does not work offline.

## **Backend**

- TypeORM
- Postgres
- Type-GraphQL
- Apollo Server
- Redis
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

## **About**

Hello, I'm fedellen and this is my first typescript project -🔥🔥-🔥🔥->👍

Typescript was the hardest part of my recent webdev learning journey. Whenever I encounter something frustrating and difficult, I've always attempted to meet that problem head on. Therefore, I decided to create a simple full stack application using as much Typescript as I possibly could.

I can now safely say that Typescript is no longer difficult for me. As expected, I now prefer it over plain Javascript as it provides much more information. After about a week of using Typescript regularly it became an extremely useful tool. There was a certain moment where I stopped struggling against the compiler and started working **with** the compiler.

After attempting several different offline-first with Apollo Client methods, I struggled to get offline mutations to work consistently enough to include this feature. Rather than starting over with a stack that includes more robust offline functionality, I decidied to finish this app with Apollo + GraphQL.
