import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";

import type { NavbarComponent } from "./NavBar.type";

import { GoCommentDiscussion } from "react-icons/go";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

export const NavBar: React.FC<NavbarComponent> = (props) => {
  const listConv = props.conv;
  const selectId = props.selected;
  const delConv = api.conversation.delete.useMutation()
  
  async function handleDelConv(e: React.SyntheticEvent, id: string) {
    e.preventDefault()
    await delConv.mutateAsync({ id: id })
    window.location.reload()
}

  return (
    <nav className="absolute left-0 top-0 flex h-screen w-[300px] flex-col items-center text-ellipsis bg-bg-900 p-2 text-white">
      <Image
        width={500}
        height={500}
        src={"/logo.png"}
        alt="logo"
        className="my-3 w-[200px]"
      />
      <div className="flex w-full flex-col justify-start text-lg mb-2">
      <Link
          href={"/"}
          className="flex w-full gap-3 rounded-xl px-3 py-2 hover:bg-[#27282A]"
        >
          <MdAdd className="text-3xl" />
          <p>Nouveau Chat</p>
        </Link>
      </div>

      <div className="flex w-full flex-col justify-start gap-3 overflow-y-auto text-lg">
        
        {listConv &&
          listConv.length > 0 &&
          listConv.map((conv) => {
            return (
              <div className="flex justify-between gap-1 h-14 mr-1" key={conv.id}>
                <Link
                  href={`/conversations/${conv.id}`}
                  className={`flex w-5/6 gap-3 rounded-xl px-3 py-2 text-clip ${
                    selectId && selectId === conv.id
                      ? "bg-[#27282A]"
                      : "hover:bg-[#2a2b2d]"
                  }`}
                >
                  <GoCommentDiscussion className="text-3xl" />
                  <p className="truncate">{conv.name}</p>
                </Link>
                <button 
                  className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-[rgba(220,38,38,0.2)]"
                  onClick={(e)=> void handleDelConv(e, conv.id) }
                >
                  <RiDeleteBin6Line/>
                  </button>
              </div>
            );
          })}
      </div>
    </nav>
  );
};
