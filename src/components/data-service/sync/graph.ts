import popup from "./popup";

const graph = async function(query: string, args: any = {}, operationName = "") {
  const res = await fetch("SERVER_URL/graphql", {
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
    popup(`graph error ${operationName && "(" + operationName + ") "}| ${json.errors[0].message}`, "error");
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

graph.pushPlants = async function(userID: string, plants: plantDescription[]): Promise<[plantMetaInfo]> {
  return await graph(
    `mutation updatePlants($author: String! $plants:[PlantInput]){
      updatePlants(author:$author plants:$plants){
        id
        name
      }
    }`,
    {
      author: userID,
      plants: plants
    }
  );
};

graph.getUpdatedPlants = async function(userID: string, plants: plantDescription[]) {
  const res = await graph(
    `query getUpdatePlants($author: String! $plants:[PlantMetaInput]){
      getUpdatedPlants(author:$author plants:$plants){
        meta{
          name
        }
      }
    }`,
    {
      author: userID,
      plants: plants
    }
  );
  if (res) {
    return res.getUpdatedPlants;
  } else {
    console.error("error");
  }
};

export default graph;
