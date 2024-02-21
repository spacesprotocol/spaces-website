# Spaces website

This repo hosts documentation for the [Spaces protocol](https://spacesprotocol.org). Built as a static site using [Hugo](https://gohugo.io).

## Contributing

### Prerequisites

Before you begin, make sure you have [Hugo](https://gohugo.io/) installed.


### Getting started

Clone the repository to your local machine using Git:

```
$ git clone https://github.com/spacesprotocol/spaces-website.git
$ cd spaces-website
```

Run Hugo locally

```
$ hugo server
```

This command will build the site and start a local server. By default, the site will be available at http://localhost:1313/.


### Making changes

Edit the documentation files located in the `content/` directory. Hugo will automatically reload the site as you make changes, allowing you to preview your updates in real time.


### Building the site

To generate a static version of the docs, run the following command:

```
$ hugo
```

The compiled version will be stored in the `public` directory.