import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  const url =
    "https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif";
  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center gap-10">
        <Image
          width={400}
          height={400}
          loader={() => url}
          src={url}
          alt="Les erreurs 404, envie de crever"
          className="max-w-[50%]"
          unoptimized
        />
        <h1>Et merde, une 404, envie de crever</h1>
        <button
          className="rounded-lg bg-bg-900 px-5 py-4 text-xl font-semibold text-white"
          onClick={() => router.push("/")}
        >
          Chat{" "}
          <span className="rounded-lg bg-logo-800 px-3 py-1 text-black">
            CPT
          </span>
        </button>
      </main>
    </>
  );
}
