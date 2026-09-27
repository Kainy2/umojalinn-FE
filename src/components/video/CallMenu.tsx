import { Button } from "../ui/button";
import { PageType } from "./VideoCall";

type CallMenuProps = {
  setPage: (page: PageType) => void;
};

const CallMenu = ({ setPage }: CallMenuProps) => {
  return (
    <div className="min-h-screen grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[10vw] px-[20vw] py-[30vh]">
      <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-lg px-5 py-10">
        <Button onClick={() => setPage("create")}>
          Create Call
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-lg px-5 py-10">
        <Button onClick={() => setPage("join")}>
          Join
        </Button>
      </div>
    </div>
  );
};

export default CallMenu;
