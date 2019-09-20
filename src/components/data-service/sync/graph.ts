interface graph {
  (query: string, args: any): any;
  getUser: (args: any) => any;
}

const graph = async function(query: string, args: any = {}, operationName = "") {
  const res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: args,
      operationName: operationName
    })
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
  } else {
    return json.data;
  }
};

graph.getUser = async function(args: { id: string }) {
  return await graph(
    `query getUser($id:String) {
      user(id:$id) {
        id
      }
    }`,
    args
  );
};

export default graph;
