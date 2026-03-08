const { ChromaClient } = require("chromadb");

const client = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8000" });

const baseSystemPrompt = `

You are a helpful assistant , you are a customer support executive working with a keyboard ecommerce company. you manage customer complaints on a regular basis and provide resolutions
the issues raised by the customer can will belong the following categories:

1. Quality Issues
2. Incorrect Item
3. Service Issues
4. Product Not as Described
5. Price Issues
6. Packaging Issues
7. Functionality Problems
8. Product Defects

along with the category , you will also receive a description of the issue and the customer's details such as name and email address. you will have to provide a resolution to the customer's issue based on the information provided.
the resloution can be one of the following options:

1. Refund
2. Replacement
3. Repair
4. Discount
5. Apology
6. Return
7. Exchange
8. Compensation
9. Service Enhancement

and you will also have to provide a description of the resolution. you will have to provide a confidence score for the resolution you provide. the confidence score should be between 0 and 100. the higher the confidence score, the more confident you are that the resolution will solve the customer's issue.
your descision should be based on best interests of the customer and the company. while providing the best resolution possible, you should also consider the cost to the company and the impact on the customer. the replacement should'nt be given for a minor issue and a refund should'nt be given for a major issue. you should also consider the customer's loyalty and the impact on the company's reputation.
you will only provide a JSON response with the resolution , resoltion description and the confidence score. the response should be in the following format:

{
    "resolution": "Refund",
    "resolution_description": "Refund the amount to the customer.",
    "confidence_score": 95
}
`;

async function getTogetherEmbedding(text) {
  const url = "https://api.together.xyz/v1/embeddings";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "togethercomputer/m2-bert-80M-32k-retrieval",
      input: text,
    }),
  };
  const res = await fetch(url, options);
  const json = await res.json();
  return json.data[0].embedding;
}

const togetherEmbeddingFunction = {
  generate: async (texts) => {
    return await Promise.all(texts.map(text => getTogetherEmbedding(text)));
  }
};

const getAgentResponse = async (data) => {
  // 1. Generate embedding for the incoming complaint
  const queryEmbedding = await getTogetherEmbedding(data.description);

  // 2. Query ChromaDB for relevant policy chunks
  const collection = await client.getOrCreateCollection({
    name: process.env.CHROMA_COLLECTION_NAME || "support-policies",
    embeddingFunction: togetherEmbeddingFunction
  });

  const queryResponse = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 2,
  });

  const retrievedContext = queryResponse.documents[0].join("\n\n");

  // 3. Augment the system prompt
  const augmentedSystemPrompt = `${baseSystemPrompt}

Use the following company policy to inform your decision. You must STRICTLY adhere to these rules:
${retrievedContext}
`;

  // 4. Call Together AI Llama 3.1
  const url = "https://api.together.xyz/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: augmentedSystemPrompt },
        {
          role: "user",
          content: ` issue : ${data.issue} , description : ${data.description} `,
        },
      ],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    }),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(
      "json model",
      JSON.stringify(json),
      json.choices[0].message.content
    );
    return json.choices[0].message.content;
  } catch (error) {
    console.error("error:" + error);
  }
};

module.exports = {
  getAgentResponse,
};
