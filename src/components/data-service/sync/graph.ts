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
    const d = `graph error ${operationName && "(" + operationName + ") "}| `;
    throw json.errors[0].message;
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
    args,
    "getUser"
  );
};

graph.createUser = async function() {
  return await graph(
    `mutation createUser {
      user {
        id
      }
    }`,
    {},
    "createUser"
  );
};

graph.getUpdatedPlants = async function(userID: string, plants: plantDescription[]) {
  return await graph(
    `mutation getUpdatePlants($userID:String $plants:[Plant]){
      getUpdatedPlants(author:$userID, plants:$plants) {
        meta {
          name
          author
        },
        
      }
    }`,
    {
      userID: userID,
      plants: plants
    }
  );
};

export default graph;
