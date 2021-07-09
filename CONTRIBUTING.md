# Contributing

I appreciate contributions by the community. If you'd like to contribute, please follow the guidelines below.

## Reporting Issues and Asking Questions

Before opening an issue, please search the [issue tracker](https://github.com/ericgio/react-bootstrap-typeahead/issues) to make sure your issue hasn't already been reported.

### Bugs and Improvements

I use the issue tracker to keep track of bugs and future improvements to the typeahead, the examples, and the documentation. Please feel free to open issues to discuss improvements, architecture, theory, internal implementation, etc. If a topic has been discussed before, I will ask you to join the previous discussion.

### Getting Help

**For support or usage questions like "how do I do X" and "my code doesn't work", please search and ask on StackOverflow first.**

StackOverflow is a much better forum for getting help with these types of issues than Github, and helps keep the issue tracker more focused and manageable. Be sure to use the ["react-bootstrap-typeahead" tag](https://stackoverflow.com/questions/ask?tags=react-bootstrap-typeahead,reactjs).

### Be descriptive and use specific examples

Don't simply say "This doesn't work." Please post examples of your code if you think you've run into a bug, or include an in-depth description of your use-case if you're asking for a feature.

### "Can you add a prop for {X}?"

My goal with this component is to provide out-of-the-box functionality for common use-cases, and a flexible API so developers can customize the behavior in all other cases. I feel strongly that React components with a long list of highly specific props are simply not well thought out. Given that, it's unlikely I'll add a prop for your specific case unless you can convince me that it's much more common than I think.

If you have a use-case that isn't covered by the current API and you want to request support for it, please try to frame your problem in a general way, and suggest a solution that might also work for another person who has similar, but slightly different constraints.

## Pull Requests

For non-trivial changes, please open an issue with a proposal for a new feature or refactoring before starting on the work. I don't want you to waste your time on a pull request that I won't want to accept.

However, if you feel like the best way to start the conversation is through code or you've already made the change, feel free to go ahead and submit a request.

### Linting and Tests

Please run the linter and test suite before submitting a PR. This helps ensure that your changes follow style guidelines and don't break anything. It will help both of us save time in avoiding minor comments and back-and-forth.

To lint your code:

```
npm run lint
```

To run tests:

```
npm test
```

### Process

In general, the contribution workflow should be:

- Open a new issue in the [issue tracker](https://github.com/ericgio/react-bootstrap-typeahead/issues).
- Fork the repo and make changes.
- Make sure all tests pass and there are no linting errors.
- Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, I'll try to get back to you as soon as possible. I may suggest some changes or improvements.

Thank you for contributing!
