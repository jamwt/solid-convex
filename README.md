# SolidJS + Convex

This repo demonstrates a very basic library to bind SolidJS projects to the
Convex global state management system.

The heart of this library is in `src/cvxsolid.ts`.

## How to use

**1. Install all dependencies**

    $ npm i

**2. Set up your Convex instance**

    $ npx convex login
    $ npx convex init
    $ npx convex push

**3. Run the application**

    $ npm run dev

**4. Try it out**

Log in to https://dashboard.convex.dev, and then click the increment button
on the app. Check out the Convex logs and data view to see the global state
update in the database, and watch new global state values reactively update
in your browser.
