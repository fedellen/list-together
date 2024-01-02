# TODO

List Together is live at <https://listtogether.app>

Below is a list of features/fixes we would like implemented if we spend more time on this project

- Strike notes individually, rather than with item
- Share list via link or email. Shared user would still need to create account upon clicking share link.
- Optimistic responses on item mutations for quicker user interaction, especially for users located further from the server (Toronto)
- More back-end resolver tests, there remains some uncovered logic
- Add test user creation from front-to-back without Passport APIs for a better dev environment (for collaborators)
- Implement testing on front-end / end to end testing
- Convert server callbacks to Redis (or cron jobs) to prevent them from being cancelled (Only related to Smart Features)
- Add an `./app` directory with a React Native version of List Together
- Implement offline mutation capabilities for Apollo Client
