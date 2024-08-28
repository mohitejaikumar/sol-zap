
import Image from "next/image";
import DemoImage from "../../public/demo.png";

export default function Home() {
  
  return (
      <div className="mt-16 bg-[##f0f1fa]">
        
        <div className="w-full flex flex-col justify-center items-center mt-24">
          <div className="text-5xl font-bold ">
            Automate Your Solana Workflows
          </div>
          <div className="text-2xl font-medium mt-3">
            Track your favourite solana wallet address
          </div>
          <Image
            src={DemoImage}
            width={1000}
            height={400}
            alt="demo"
            style={{height:"500px"}}
          />
        </div>
      </div>
  );
}
