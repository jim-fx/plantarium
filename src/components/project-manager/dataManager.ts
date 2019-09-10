async function bootstrap() {
  const res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      query: `
        query getSinglePlant($plantTopic: String!) {
            plants(topic: $plantTopic) {
                title
            }
        }`,
      operationName: "getSinglePlant",
      variables: {
        plantTopic: "Node.js"
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

  console.log(res.data);
}

//bootstrap();

export default function() {}
