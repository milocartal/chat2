import Head from "next/head";
import Image from "next/image";

import { api } from "~/utils/api";
import type { Conversation, Message } from "@prisma/client";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "~/server/db";
import { NavBar } from "~/components";
import { useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";

export const getServerSideProps: GetServerSideProps<{
  conversations: Conversation[];
  messages: Message[];
  selectConv: Conversation;
}> = async function (context) {
  const selectConv = await prisma.conversation.findUnique({
    where: {
      id: context.query.id as string,
    },
  });

  if (!selectConv) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const messages = await prisma.message.findMany({
    where: {
      idConv: context.query.id as string,
    },
  });

  const conversations = await prisma.conversation.findMany();

  return {
    props: {
      conversations: JSON.parse(
        JSON.stringify(conversations),
      ) as Conversation[],
      selectConv: JSON.parse(JSON.stringify(selectConv)) as Conversation,
      messages: JSON.parse(JSON.stringify(messages)) as Message[],
    },
  };
};

const Conv: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ conversations, selectConv, messages }) => {
  const [promptInput, setpromptInput] = useState("");
  const [disable, setDisable] = useState(false)

  const ref = useRef<null | HTMLDivElement>(null);

  const scrollToElement = () => {
    ref.current?.scrollIntoView({ behavior: "instant" });
  };

  const createMsg = api.message.create.useMutation();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setDisable(true)

    await createMsg.mutateAsync({
      texte: promptInput,
      username: "anonycat",
      idConv: selectConv.id,
    });

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ask: promptInput }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    await createMsg.mutateAsync({
      texte: data.result,
      username: "CHAT",
      idConv: selectConv.id,
    });

    setpromptInput("");
    window.location.reload();
  }

  useEffect(() => {
    scrollToElement();
  }, []);

  return (
    <>
      <Head>
        <title>CHAT CPT</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`flex h-screen w-screen flex-col items-center justify-between bg-bg-100 pl-[300px] text-bg-900 ${disable && "cursor-wait"}`}>
        <div
          id="chatbox"
          className="pt-15 flex flex-col items-center justify-start overflow-y-auto py-5"
        >
          {messages &&
            messages.length > 0 &&
            messages.map((msg) => {
              let img = "/anonycat.jpeg";
              if (msg.username === "CHAT") {
                img = "/catDarwing.png";
              }

              return (
                <div
                  key={msg.id}
                  ref={ref}
                  className={`mt-5 flex w-full flex-col gap-3 px-[25%] py-3 text-bg-900 ${
                    msg.username === "CHAT" ? "" : "bg-logo-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Image
                      src={img}
                      alt="profil picture"
                      width={50}
                      height={50}
                      className="h-[25px] w-[25px]"
                    />
                    <p>{msg.username}</p>
                  </span>

                  <p>{msg.texte}</p>
                  <p className="self-end">
                    {msg.send
                      .toString()
                      .slice(0, 10)
                      .replaceAll("-", "/")
                      .split("/")
                      .reverse()
                      .join("/")}
                  </p>
                </div>
              );
            })}
        </div>

        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={(e) => onSubmit(e)}
          className="flex w-full justify-center gap-2 bg-bg-900 p-5"
        >
          <input
            id="ask"
            name="ask"
            className="w-[400px] rounded-lg px-3 py-2"
            value={promptInput}
            placeholder="Quels sont tes véritables désires ?"
            onChange={(e) => setpromptInput(e.target.value)}
            disabled = {disable}
          />
          <button type="submit" className="text-3xl text-white">
            {" "}
            <LuSend />{" "}
          </button>
        </form>

        <NavBar conv={conversations} selected={selectConv.id} />
      </main>
    </>
  );
};

export default Conv;