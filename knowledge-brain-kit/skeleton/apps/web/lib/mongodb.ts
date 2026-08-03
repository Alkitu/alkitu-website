import { MongoClient } from "mongodb";

const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

/**
 * Crea (una vez) la promesa de conexión. Lanza si falta `MONGODB_URI`, pero
 * SOLO al usarse (await), no al importar el módulo: así el build puede recolectar
 * page-data sin una base de datos real, y los consumidores degradan con try/catch.
 * En dev reusa el cliente entre hot-reloads para no abrir conexiones de más.
 */
function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta la variable de entorno "MONGODB_URI"');
  }
  const uri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, options).connect();
  }
  return clientPromise;
}

// Thenable perezoso: la conexión (y el throw si falta la env) solo ocurre al
// hacer `await clientPromise`, nunca al importar → el build no rompe sin DB.
// Se tipa como Promise<MongoClient> (cast) para que los consumidores que esperan
// una promesa real (p. ej. el adaptador de auth) sigan compilando; en runtime
// solo se usa `then`/`await`, que el thenable implementa.
const lazyClientPromise = {
  then(
    onfulfilled?: ((value: MongoClient) => unknown) | null,
    onrejected?: ((reason: unknown) => unknown) | null,
  ) {
    return getClientPromise().then(onfulfilled as never, onrejected as never);
  },
} as unknown as Promise<MongoClient>;

export default lazyClientPromise;
