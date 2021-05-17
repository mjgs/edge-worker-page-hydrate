addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
});

// do not set to true in production!
const DEBUG = true;

class ElementHandler {
  constructor(message) {
    this.message = message;
  }

  element(element) {
    element.setInnerContent(this.message);
  }
}

async function handleRequest(req) {
  try {
    const pagePromise = fetch(req);
    const dataPromise = fetch(`${API_URL}`);

    const [ page, data ] = await Promise.all([ pagePromise, dataPromise ]);
    const { message } = await data.json();
 
    return new HTMLRewriter()
      .on('h1', new ElementHandler(message))
      .transform(page);
  } catch (e) {
    if (DEBUG) {
      return new Response(e.message || e.toString(), {
        status: 500
      });
    }
    else {
      return new Response(`There was an error while loading page: ${req.url}`, {
        status: 500
      });
    }
  }
}
