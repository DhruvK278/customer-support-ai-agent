const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const fs = require("fs");
const { ChromaClient } = require("chromadb");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const client = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8000" });

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

async function ingest() {
    console.log("Reading policy document...");
    const text = fs.readFileSync(path.join(__dirname, "../company_policy.md"), "utf8");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 50,
    });
    const chunks = await splitter.createDocuments([text]);

    const collection = await client.getOrCreateCollection({
        name: process.env.CHROMA_COLLECTION_NAME || "support-policies",
        embeddingFunction: togetherEmbeddingFunction
    });

    const ids = [];
    const embeddings = [];
    const metadatas = [];
    const documents = [];

    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i].pageContent;
        const embedding = await getTogetherEmbedding(chunkText);

        ids.push(`chunk-${i}`);
        embeddings.push(embedding);
        metadatas.push({ text: chunkText });
        documents.push(chunkText);
    }

    console.log("Upserting vectors to ChromaDB...");
    await collection.add({
        ids: ids,
        embeddings: embeddings,
        metadatas: metadatas,
        documents: documents
    });
    console.log("Ingestion complete!");
}

ingest().catch(console.error);
